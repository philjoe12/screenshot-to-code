from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from supabase import create_client, Client
import os
from config.credit_usage import (
    FeatureType, 
    get_all_features_info, 
    get_credit_cost,
    calculate_dynamic_cost,
    PLAN_FEATURES,
    is_feature_available
)

# Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

router = APIRouter()

class CreditUsageRequest(BaseModel):
    feature_type: FeatureType
    priority: Optional[bool] = False
    file_size_mb: Optional[float] = 0
    framework: Optional[str] = None
    is_iteration: Optional[bool] = False

class CreditUsageResponse(BaseModel):
    feature_type: FeatureType
    base_cost: int
    calculated_cost: int
    description: str
    complexity_level: str
    ai_models_used: List[str]
    processing_time_estimate: str

class UserCreditSummary(BaseModel):
    user_id: str
    credits_remaining: int
    credits_used: int
    total_credits_purchased: int
    plan: str
    last_usage_date: Optional[str]
    usage_this_month: int
    available_features: List[FeatureType]

class CreditUsageHistory(BaseModel):
    user_id: str
    feature_type: FeatureType
    credits_used: int
    model_used: str
    framework: str
    input_type: str
    created_at: str

@router.get("/api/credit-usage/features")
async def get_all_features():
    """Get information about all features and their credit costs"""
    try:
        features_info = get_all_features_info()
        
        response = []
        for feature_type, cost_info in features_info.items():
            response.append({
                "feature_type": feature_type,
                "base_cost": cost_info.base_cost,
                "description": cost_info.description,
                "complexity_level": cost_info.complexity_level,
                "ai_models_used": cost_info.ai_models_used,
                "processing_time_estimate": cost_info.processing_time_estimate
            })
        
        return {"features": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/credit-usage/calculate", response_model=CreditUsageResponse)
async def calculate_credit_cost(request: CreditUsageRequest):
    """Calculate the credit cost for a specific feature with given parameters"""
    try:
        base_cost = get_credit_cost(request.feature_type)
        calculated_cost = calculate_dynamic_cost(
            request.feature_type,
            priority=request.priority,
            file_size_mb=request.file_size_mb,
            framework=request.framework,
            is_iteration=request.is_iteration
        )
        
        feature_info = get_all_features_info()[request.feature_type]
        
        return CreditUsageResponse(
            feature_type=request.feature_type,
            base_cost=base_cost,
            calculated_cost=calculated_cost,
            description=feature_info.description,
            complexity_level=feature_info.complexity_level,
            ai_models_used=feature_info.ai_models_used,
            processing_time_estimate=feature_info.processing_time_estimate
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/credit-usage/user/{user_id}/summary", response_model=UserCreditSummary)
async def get_user_credit_summary(user_id: str):
    """Get comprehensive credit summary for a user"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Credit system not configured")
        
        # Get user credits
        credits_response = supabase.table("user_credits").select("*").eq("user_id", user_id).single().execute()
        
        if not credits_response.data:
            raise HTTPException(status_code=404, detail="User credits not found")
        
        credits = credits_response.data
        
        # Calculate usage this month
        current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        usage_response = supabase.table("conversion_history").select("credits_used").eq("user_id", user_id).gte("created_at", current_month.isoformat()).execute()
        
        usage_this_month = sum(item.get("credits_used", 1) for item in usage_response.data) if usage_response.data else 0
        
        # Get available features based on plan
        plan = credits.get("plan", "free")
        available_features = PLAN_FEATURES.get(plan, [])
        
        return UserCreditSummary(
            user_id=user_id,
            credits_remaining=credits["credits_remaining"],
            credits_used=credits["credits_used"],
            total_credits_purchased=credits.get("total_credits_purchased", 0),
            plan=plan,
            last_usage_date=credits.get("last_used_date"),
            usage_this_month=usage_this_month,
            available_features=available_features
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/credit-usage/user/{user_id}/history")
async def get_user_credit_history(user_id: str, limit: int = 50, offset: int = 0):
    """Get user's credit usage history"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Credit system not configured")
        
        # Get usage history
        history_response = supabase.table("conversion_history").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(limit).offset(offset).execute()
        
        if not history_response.data:
            return {"history": [], "total_count": 0}
        
        history = []
        for item in history_response.data:
            history.append(CreditUsageHistory(
                user_id=item["user_id"],
                feature_type=item.get("feature_type", "code_generation_image"),
                credits_used=item.get("credits_used", 1),
                model_used=item["model_used"],
                framework=item["framework"],
                input_type=item["input_type"],
                created_at=item["created_at"]
            ))
        
        # Get total count
        count_response = supabase.table("conversion_history").select("*", count="exact").eq("user_id", user_id).execute()
        total_count = count_response.count if count_response.count else 0
        
        return {
            "history": history,
            "total_count": total_count,
            "limit": limit,
            "offset": offset
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/credit-usage/user/{user_id}/analytics")
async def get_user_credit_analytics(user_id: str):
    """Get user's credit usage analytics"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Credit system not configured")
        
        # Get usage by feature type
        usage_response = supabase.table("conversion_history").select("feature_type, credits_used").eq("user_id", user_id).execute()
        
        if not usage_response.data:
            return {"analytics": {}}
        
        # Aggregate by feature type
        usage_by_feature = {}
        total_credits_used = 0
        
        for item in usage_response.data:
            feature_type = item.get("feature_type", "code_generation_image")
            credits_used = item.get("credits_used", 1)
            
            if feature_type not in usage_by_feature:
                usage_by_feature[feature_type] = {"count": 0, "total_credits": 0}
            
            usage_by_feature[feature_type]["count"] += 1
            usage_by_feature[feature_type]["total_credits"] += credits_used
            total_credits_used += credits_used
        
        # Calculate percentages
        for feature_type in usage_by_feature:
            usage_by_feature[feature_type]["percentage"] = (
                usage_by_feature[feature_type]["total_credits"] / total_credits_used * 100
            ) if total_credits_used > 0 else 0
        
        # Get usage by month (last 6 months)
        six_months_ago = datetime.now() - timedelta(days=180)
        monthly_usage_response = supabase.table("conversion_history").select("created_at, credits_used").eq("user_id", user_id).gte("created_at", six_months_ago.isoformat()).execute()
        
        monthly_usage = {}
        if monthly_usage_response.data:
            for item in monthly_usage_response.data:
                created_at = datetime.fromisoformat(item["created_at"].replace("Z", "+00:00"))
                month_key = created_at.strftime("%Y-%m")
                credits_used = item.get("credits_used", 1)
                
                if month_key not in monthly_usage:
                    monthly_usage[month_key] = 0
                monthly_usage[month_key] += credits_used
        
        return {
            "analytics": {
                "total_credits_used": total_credits_used,
                "usage_by_feature": usage_by_feature,
                "monthly_usage": monthly_usage,
                "most_used_feature": max(usage_by_feature.items(), key=lambda x: x[1]["count"])[0] if usage_by_feature else None
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/credit-usage/plans")
async def get_plan_features():
    """Get features available for each plan"""
    try:
        return {"plan_features": PLAN_FEATURES}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/credit-usage/user/{user_id}/feature-availability/{feature_type}")
async def check_feature_availability(user_id: str, feature_type: FeatureType):
    """Check if a feature is available for a user based on their plan"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Credit system not configured")
        
        # Get user's plan
        credits_response = supabase.table("user_credits").select("plan").eq("user_id", user_id).single().execute()
        
        if not credits_response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        plan = credits_response.data.get("plan", "free")
        available = is_feature_available(feature_type, plan)
        
        return {
            "feature_type": feature_type,
            "plan": plan,
            "available": available,
            "credit_cost": get_credit_cost(feature_type)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))