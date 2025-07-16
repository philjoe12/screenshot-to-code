# /backend/routes/payments.py
from fastapi import APIRouter, Depends, HTTPException, Request, Body
from fastapi.responses import JSONResponse
from supabase import create_client, Client
import stripe
import os
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
from datetime import datetime, timedelta
from ..services.pricing_service import PricingService

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Initialize Stripe
stripe_key = os.environ.get("STRIPE_SECRET_KEY")
if stripe_key:
    stripe.api_key = stripe_key
endpoint_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")

# Initialize pricing service
pricing_service = PricingService(supabase) if supabase else None

router = APIRouter()

class CheckoutSessionRequest(BaseModel):
    userId: str
    planId: str

@router.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest):
    """Create a Stripe checkout session for purchasing credits"""
    try:
        # Handle development mode
        if not stripe_key or not supabase:
            return {
                "sessionId": "dev_session_id", 
                "message": "Running in development mode - payment simulation"
            }
            
        # Check if user exists - Note: Supabase Python client is synchronous
        try:
            user_response = supabase.auth.admin.get_user_by_id(request.userId)
            if not user_response or not user_response.user:
                raise HTTPException(status_code=404, detail="User not found")
            user_email = user_response.user.email
        except Exception as e:
            print(f"Error getting user: {str(e)}")
            raise HTTPException(status_code=404, detail="User not found")
            
        # Get plan details
        if request.planId not in PLANS:
            raise HTTPException(status_code=400, detail="Invalid plan ID")
            
        plan = PLANS[request.planId]
        
        if not plan["price_id"]:
            raise HTTPException(status_code=500, detail="Stripe price ID not configured")
        
        # Create checkout session for one-time payment
        success_url = f"{os.environ.get('FRONTEND_URL', 'http://localhost:5173')}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{os.environ.get('FRONTEND_URL', 'http://localhost:5173')}/account"
        
        # Create one-time payment for credits
        checkout_session = stripe.checkout.Session.create(
            customer_email=user_email,
            payment_method_types=["card"],
            line_items=[
                {
                    "price": plan["price_id"],
                    "quantity": 1,
                },
            ],
            mode="payment",  # One-time payment
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "userId": request.userId,
                "planId": request.planId,
                "credits": str(plan["credits"])
            },
            # Add description for better UX
            payment_intent_data={
                "description": f"{plan['name']} - {plan['credits']} credits for Pix2Code"
            }
        )
        
        return {"sessionId": checkout_session.id}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating checkout session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events for payment processing"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    # Handle development mode
    if not supabase or not stripe_key or not endpoint_secret:
        return JSONResponse(content={"status": "success", "mode": "development"})
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        print(f"Invalid payload: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        print(f"Invalid signature: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the checkout.session.completed event for one-time payments
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        
        # Check if the payment was successful
        if session["payment_status"] != "paid":
            return JSONResponse(content={"status": "pending"})
        
        # Get user and plan from metadata
        user_id = session["metadata"]["userId"]
        plan_id = session["metadata"]["planId"]
        credits = int(session["metadata"]["credits"])
        
        try:
            # Update the user's credits in the database
            # Check if user already has credits - Supabase calls are synchronous
            user_credits_response = supabase.table("user_credits").select("*").eq("user_id", user_id).execute()
            
            if user_credits_response.data and len(user_credits_response.data) > 0:
                # Add to existing credits
                current_credits = user_credits_response.data[0]["credits_remaining"]
                
                update_response = supabase.table("user_credits").update({
                    "credits_remaining": current_credits + credits,
                    "last_purchase_date": datetime.now().isoformat(),
                    "plan": plan_id
                }).eq("user_id", user_id).execute()
                
                if not update_response.data:
                    print(f"Failed to update credits for user {user_id}")
            else:
                # Create new credit record
                insert_response = supabase.table("user_credits").insert({
                    "user_id": user_id,
                    "credits_remaining": credits,
                    "credits_used": 0,
                    "plan": plan_id,
                    "last_purchase_date": datetime.now().isoformat()
                }).execute()
                
                if not insert_response.data:
                    print(f"Failed to create credit record for user {user_id}")
            
            # Log the purchase
            payment_history_response = supabase.table("payment_history").insert({
                "user_id": user_id,
                "amount": session["amount_total"] / 100,  # Convert from cents
                "credits_purchased": credits,
                "plan": plan_id,
                "stripe_session_id": session["id"],
                "payment_date": datetime.now().isoformat(),
                "status": "completed"
            }).execute()
            
            if not payment_history_response.data:
                print(f"Failed to log payment history for user {user_id}")
            
            print(f"Successfully processed payment for user {user_id}: {credits} credits added")
            
        except Exception as e:
            print(f"Error processing webhook: {str(e)}")
            # Don't raise exception here as payment was successful
            # Log error but return success to Stripe
    
    return JSONResponse(content={"status": "success"})

@router.post("/verify-payment")
async def verify_payment(session_id: str = Body(..., embed=True)):
    """Verify a payment session after successful checkout"""
    try:
        # Handle development mode
        if not stripe_key:
            return {
                "success": True, 
                "session": {"id": "dev_session", "payment_status": "paid"}, 
                "mode": "development"
            }
            
        # Retrieve the session from Stripe
        session = stripe.checkout.Session.retrieve(session_id)
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Check if the payment was successful
        if session["payment_status"] != "paid":
            return {"success": False, "session": session, "message": "Payment not completed"}
        
        return {"success": True, "session": session}
    
    except Exception as e:
        print(f"Error verifying payment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/credits/{user_id}")
async def get_user_credits(user_id: str):
    """Get a user's credit balance"""
    try:
        # Handle development mode
        if not supabase:
            return {
                "credits_remaining": 999,
                "credits_used": 0,
                "user_id": user_id,
                "plan": "development",
                "mode": "development"
            }
            
        # Supabase calls are synchronous
        response = supabase.table("user_credits").select("*").eq("user_id", user_id).single().execute()
        
        if response.data:
            return response.data
        else:
            # If user doesn't have credits yet, return 0
            return {
                "credits_remaining": 0,
                "credits_used": 0,
                "user_id": user_id,
                "plan": "free"
            }
    
    except Exception as e:
        print(f"Error getting user credits: {str(e)}")
        # Return 0 credits on error rather than raising exception
        return {
            "credits_remaining": 0,
            "credits_used": 0,
            "user_id": user_id,
            "plan": "free"
        }

@router.get("/user/transactions/{user_id}")
async def get_user_transactions(user_id: str):
    """Get a user's transaction history"""
    try:
        # Handle development mode
        if not supabase:
            return []
            
        # Get payment history
        payment_response = supabase.table("payment_history").select("*").eq("user_id", user_id).order("payment_date", desc=True).execute()
        
        # Get usage history (recent conversions)
        usage_response = supabase.table("conversion_history").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(50).execute()
        
        transactions = []
        
        # Add payment transactions
        if payment_response.data:
            for payment in payment_response.data:
                transactions.append({
                    "id": payment.get("id"),
                    "type": "purchase",
                    "amount": payment.get("credits_purchased", 0),
                    "package": PLANS.get(payment.get("plan", ""), {}).get("name", payment.get("plan", "")),
                    "created_at": payment.get("payment_date"),
                    "status": payment.get("status", "completed"),
                    "description": f"Purchased {payment.get('credits_purchased', 0)} credits"
                })
        
        # Add usage transactions
        if usage_response.data:
            for usage in usage_response.data:
                transactions.append({
                    "id": usage.get("id"),
                    "type": "usage",
                    "amount": 1,  # Each usage is 1 credit
                    "created_at": usage.get("created_at"),
                    "status": "completed",
                    "description": f"Code generation ({usage.get('model_used', 'Unknown')} - {usage.get('framework', 'Unknown')})"
                })
        
        # Sort by date descending
        transactions.sort(key=lambda x: x["created_at"], reverse=True)
        
        return transactions
    
    except Exception as e:
        print(f"Error getting user transactions: {str(e)}")
        return []

@router.get("/pricing")
async def get_pricing():
    """Get current pricing plans"""
    return {
        "plans": [
            {
                "id": plan_id,
                "name": plan_data["name"],
                "credits": plan_data["credits"],
                "price": plan_data["amount"] / 100,  # Convert from cents to dollars
                "price_per_credit": round((plan_data["amount"] / 100) / plan_data["credits"], 2),
                "description": plan_data["description"],
                "popular": plan_id == "basic"  # Mark basic plan as popular
            }
            for plan_id, plan_data in PLANS.items()
        ],
        "currency": "USD",
        "price_per_credit": 0.15
    }