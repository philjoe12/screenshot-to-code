# /root/screenshot-to-code/backend/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel
from supabase import create_client, Client
import os
from typing import Optional
from datetime import datetime

router = APIRouter()

# Initialize Supabase client - REQUIRED for authentication
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

if not supabase_url or not supabase_key:
    raise RuntimeError(
        "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables. "
        "Authentication requires Supabase to be configured."
    )

supabase: Client = create_client(supabase_url, supabase_key)

class UserSignUp(BaseModel):
    email: str
    password: str

class UserSignIn(BaseModel):
    email: str
    password: str

class ResetPassword(BaseModel):
    email: str

class GetUserCredits(BaseModel):
    user_id: str

class UseCredit(BaseModel):
    user_id: str
    model_used: str
    framework: str
    input_type: str

# Middleware to verify auth token - ALWAYS require authentication
async def verify_token(request: Request):
    """Always require authentication via Supabase"""
    auth_token = request.cookies.get("sb-auth-token")
    
    # Check Authorization header as fallback
    if not auth_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            auth_token = auth_header.split(" ")[1]
    
    if not auth_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Verify the token with Supabase
        user_response = supabase.auth.get_user(auth_token)
        
        if user_response.error:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return user_response.user
    
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        raise HTTPException(status_code=401, detail="Authentication failed")

@router.post("/signup")
async def sign_up(user: UserSignUp):
    """Register a new user with Supabase"""
    try:
        # Sign up user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
        })
        
        if auth_response.error:
            raise HTTPException(status_code=400, detail=auth_response.error.message)
        
        user_id = auth_response.user.id if auth_response.user else None
        
        if not user_id:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        # The database trigger will automatically create credits for new users
        # We can optionally verify credits were created, but it's not required
        print(f"User {user_id} created successfully. Credits will be created by database trigger.")
        
        return {
            "success": True,
            "message": "User registered successfully. Please check your email to verify your account.",
            "requiresEmailVerification": True
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/signin")
async def sign_in(user: UserSignIn, response: Response):
    """Sign in a user with Supabase"""
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        
        if auth_response.error:
            raise HTTPException(status_code=400, detail=auth_response.error.message)
        
        # Set auth cookie
        response.set_cookie(
            key="sb-auth-token",
            value=auth_response.session.access_token,
            httponly=True,
            max_age=3600 * 24 * 7,  # 1 week
            secure=os.environ.get("ENVIRONMENT", "development") == "production",
            samesite="lax" if os.environ.get("ENVIRONMENT", "development") == "development" else "strict"
        )
        
        return {
            "success": True,
            "user": {
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "email_confirmed_at": auth_response.user.email_confirmed_at
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/signout")
async def sign_out(request: Request, response: Response):
    """Sign out a user"""
    auth_token = request.cookies.get("sb-auth-token")
    
    if auth_token:
        try:
            # Sign out from Supabase
            supabase.auth.sign_out()
        except Exception as e:
            print(f"Error signing out from Supabase: {str(e)}")
    
    response.delete_cookie(key="sb-auth-token")
    return {"success": True}

@router.post("/reset-password")
async def reset_password(request: ResetPassword):
    """Send password reset email via Supabase"""
    try:
        response = supabase.auth.reset_password_for_email(
            request.email,
            {
                "redirect_to": f"{os.environ.get('FRONTEND_URL', 'http://localhost:5173')}/reset-password"
            }
        )
        
        if response.error:
            raise HTTPException(status_code=400, detail=response.error.message)
        
        return {"success": True, "message": "Password reset email sent"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/credits/{user_id}")
async def get_user_credits(user_id: str, current_user=Depends(verify_token)):
    """Get a user's credit information from Supabase"""
    try:
        # Verify the user is requesting their own credits
        if current_user.id != user_id:
            raise HTTPException(status_code=403, detail="Forbidden")
            
        response = supabase.table("user_credits").select("*").eq("user_id", user_id).single().execute()
        
        if hasattr(response, 'error') and response.error:
            # This should rarely happen with the trigger in place
            print(f"User credits not found for {user_id}, the trigger should have created them")
            
            # Try to fetch again in case of timing issue
            import time
            time.sleep(0.5)  # Brief delay
            
            retry_response = supabase.table("user_credits").select("*").eq("user_id", user_id).single().execute()
            
            if retry_response.data:
                return retry_response.data
            else:
                # As a last resort, return default values
                # This allows the frontend to function even if there's an issue
                print(f"Warning: Could not find credits for user {user_id} after retry")
                return {
                    "user_id": user_id,
                    "credits_remaining": 2,
                    "credits_used": 0,
                    "plan": "free",
                    "_note": "Default values returned - check database trigger"
                }
        
        return response.data
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_user_credits: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/user/use-credit")
async def use_credit(request: UseCredit, current_user=Depends(verify_token)):
    """Use a credit and log the usage in Supabase"""
    try:
        # Verify the user is using their own credits
        if current_user.id != request.user_id:
            raise HTTPException(status_code=403, detail="Forbidden")
            
        # Get user credits
        credits_response = supabase.table("user_credits").select("*").eq("user_id", request.user_id).single().execute()
        
        if hasattr(credits_response, 'error') and credits_response.error:
            raise HTTPException(status_code=404, detail="User credits not found")
        
        credits = credits_response.data
        
        # Check if user has credits
        if credits["credits_remaining"] <= 0:
            raise HTTPException(status_code=400, detail="Insufficient credits")
        
        # Update credits atomically
        new_remaining = credits["credits_remaining"] - 1
        new_used = credits["credits_used"] + 1
        
        update_response = supabase.table("user_credits").update({
            "credits_remaining": new_remaining,
            "credits_used": new_used,
            "last_used_date": datetime.utcnow().isoformat()
        }).eq("user_id", request.user_id).eq("credits_remaining", credits["credits_remaining"]).execute()
        
        # Check if update was successful (using optimistic locking)
        if not update_response.data or len(update_response.data) == 0:
            # Retry once in case of concurrent update
            credits_response = supabase.table("user_credits").select("*").eq("user_id", request.user_id).single().execute()
            if credits_response.data and credits_response.data["credits_remaining"] <= 0:
                raise HTTPException(status_code=400, detail="Insufficient credits")
            else:
                raise HTTPException(status_code=409, detail="Credit update conflict, please retry")
        
        # Log the conversion
        try:
            log_response = supabase.table("conversion_history").insert({
                "user_id": request.user_id,
                "model_used": request.model_used,
                "framework": request.framework,
                "input_type": request.input_type,
                "created_at": datetime.utcnow().isoformat()
            }).execute()
            
            if hasattr(log_response, 'error') and log_response.error:
                # Log error but don't fail the request
                print(f"Error logging conversion: {log_response.error}")
        except Exception as e:
            # Log error but don't fail the request
            print(f"Error logging conversion: {str(e)}")
        
        return {"success": True, "credits_remaining": new_remaining}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/me")
async def get_current_user(current_user=Depends(verify_token)):
    """Get current user info from Supabase"""
    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "email_confirmed_at": current_user.email_confirmed_at
        }
    }

@router.post("/refresh")
async def refresh_session(request: Request, response: Response):
    """Refresh the user's session"""
    refresh_token = request.cookies.get("sb-refresh-token")
    
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")
    
    try:
        # Refresh the session with Supabase
        auth_response = supabase.auth.refresh_session(refresh_token)
        
        if auth_response.error:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        # Update cookies with new tokens
        response.set_cookie(
            key="sb-auth-token",
            value=auth_response.session.access_token,
            httponly=True,
            max_age=3600 * 24 * 7,  # 1 week
            secure=os.environ.get("ENVIRONMENT", "development") == "production",
            samesite="lax" if os.environ.get("ENVIRONMENT", "development") == "development" else "strict"
        )
        
        response.set_cookie(
            key="sb-refresh-token",
            value=auth_response.session.refresh_token,
            httponly=True,
            max_age=3600 * 24 * 30,  # 30 days
            secure=os.environ.get("ENVIRONMENT", "development") == "production",
            samesite="lax" if os.environ.get("ENVIRONMENT", "development") == "development" else "strict"
        )
        
        return {"success": True}
        
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))