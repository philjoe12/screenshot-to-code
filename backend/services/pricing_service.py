from typing import List, Dict, Optional
from supabase import Client
import json
import os

class PricingService:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
    
    async def get_all_pricing_plans(self) -> List[Dict]:
        """Get all active pricing plans from database"""
        try:
            response = self.supabase.table("pricing_plans").select("*").eq("is_active", True).order("sort_order").execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching pricing plans: {str(e)}")
            return self._get_fallback_plans()
    
    async def get_pricing_plan_by_id(self, plan_id: str) -> Optional[Dict]:
        """Get a specific pricing plan by ID"""
        try:
            response = self.supabase.table("pricing_plans").select("*").eq("id", plan_id).eq("is_active", True).single().execute()
            return response.data if response.data else None
        except Exception as e:
            print(f"Error fetching pricing plan {plan_id}: {str(e)}")
            # Fallback to hardcoded plan
            fallback_plans = self._get_fallback_plans()
            return next((plan for plan in fallback_plans if plan["id"] == plan_id), None)
    
    async def get_pricing_config(self) -> Dict:
        """Get pricing configuration values"""
        try:
            response = self.supabase.table("pricing_config").select("*").execute()
            if response.data:
                config = {}
                for item in response.data:
                    try:
                        config[item["key"]] = json.loads(item["value"])
                    except json.JSONDecodeError:
                        config[item["key"]] = item["value"]
                return config
            return self._get_fallback_config()
        except Exception as e:
            print(f"Error fetching pricing config: {str(e)}")
            return self._get_fallback_config()
    
    async def update_pricing_plan(self, plan_id: str, updates: Dict) -> bool:
        """Update a pricing plan"""
        try:
            response = self.supabase.table("pricing_plans").update(updates).eq("id", plan_id).execute()
            return response.data is not None
        except Exception as e:
            print(f"Error updating pricing plan {plan_id}: {str(e)}")
            return False
    
    async def create_pricing_plan(self, plan_data: Dict) -> bool:
        """Create a new pricing plan"""
        try:
            response = self.supabase.table("pricing_plans").insert(plan_data).execute()
            return response.data is not None
        except Exception as e:
            print(f"Error creating pricing plan: {str(e)}")
            return False
    
    def _get_fallback_plans(self) -> List[Dict]:
        """Fallback pricing plans if database is unavailable"""
        return [
            {
                "id": "starter",
                "name": "Starter",
                "credits": 10,
                "price_cents": 150,
                "price_dollars": 1.50,
                "description": "Perfect for trying out the platform",
                "features": ["10 code generations", "All frameworks supported", "Basic support", "Export to ZIP"],
                "is_recommended": False,
                "stripe_price_id": os.environ.get("STRIPE_STARTER_PRICE_ID"),
                "sort_order": 1
            },
            {
                "id": "basic",
                "name": "Basic",
                "credits": 50,
                "price_cents": 750,
                "price_dollars": 7.50,
                "description": "Great for small projects and personal use",
                "features": ["50 code generations", "All frameworks supported", "Email support", "Export to ZIP", "History tracking"],
                "is_recommended": True,
                "stripe_price_id": os.environ.get("STRIPE_BASIC_PRICE_ID"),
                "sort_order": 2
            },
            {
                "id": "professional",
                "name": "Professional",
                "credits": 200,
                "price_cents": 3000,
                "price_dollars": 30.00,
                "description": "Ideal for freelancers and growing businesses",
                "features": ["200 code generations", "All frameworks supported", "Priority support", "Export to ZIP", "History tracking", "Advanced customization"],
                "is_recommended": False,
                "stripe_price_id": os.environ.get("STRIPE_PROFESSIONAL_PRICE_ID"),
                "sort_order": 3
            },
            {
                "id": "enterprise",
                "name": "Enterprise",
                "credits": 1000,
                "price_cents": 15000,
                "price_dollars": 150.00,
                "description": "Best for agencies and professional teams",
                "features": ["1000 code generations", "All frameworks supported", "Priority support", "Export to ZIP", "History tracking", "Advanced customization", "API access", "Custom branding"],
                "is_recommended": False,
                "stripe_price_id": os.environ.get("STRIPE_ENTERPRISE_PRICE_ID"),
                "sort_order": 4
            }
        ]
    
    def _get_fallback_config(self) -> Dict:
        """Fallback pricing config if database is unavailable"""
        return {
            "price_per_credit": 0.15,
            "free_credits_new_user": 2,
            "traditional_dev_cost": 100,
            "currency": "USD"
        }