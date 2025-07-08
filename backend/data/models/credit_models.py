# /backend/models/credit_models.py
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID

# Database Models
class UserCredits(BaseModel):
    """User credit balance model"""
    id: UUID
    user_id: UUID
    credits_remaining: int = Field(default=2, ge=0)
    credits_used: int = Field(default=0, ge=0)
    plan: str = Field(default="free", max_length=50)
    last_purchase_date: Optional[datetime] = None
    last_used_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ConversionHistory(BaseModel):
    """Code generation history model"""
    id: UUID
    user_id: UUID
    model_used: str = Field(max_length=100)
    framework: str = Field(max_length=100)
    input_type: str = Field(default="image", max_length=50)
    created_at: datetime

    class Config:
        from_attributes = True

class PaymentHistory(BaseModel):
    """Payment transaction history model"""
    id: UUID
    user_id: UUID
    amount: float = Field(gt=0)
    credits_purchased: int = Field(gt=0)
    plan: str = Field(max_length=50)
    stripe_session_id: Optional[str] = Field(max_length=255)
    payment_date: datetime
    status: str = Field(default="completed", max_length=50)

    class Config:
        from_attributes = True

# API Request/Response Models
class CreditCheckRequest(BaseModel):
    """Request model for checking credits"""
    user_id: UUID
    model_used: str
    framework: str
    input_type: Literal["image", "video"] = "image"

class CreditCheckResponse(BaseModel):
    """Response model for credit check"""
    has_credits: bool
    credits_remaining: int
    message: str

class UseCreditRequest(BaseModel):
    """Request model for using a credit"""
    user_id: UUID
    model_used: str
    framework: str
    input_type: Literal["image", "video"] = "image"

class UseCreditResponse(BaseModel):
    """Response model for credit usage"""
    success: bool
    credits_remaining: int
    message: str

class AddCreditsRequest(BaseModel):
    """Request model for adding credits (webhook)"""
    user_id: UUID
    credits: int = Field(gt=0)
    plan: str
    stripe_session_id: Optional[str] = None

class UserStatsResponse(BaseModel):
    """Response model for user statistics"""
    user_id: UUID
    email: Optional[str]
    credits_remaining: int
    credits_used: int
    plan: str
    last_purchase_date: Optional[datetime]
    last_used_date: Optional[datetime]
    total_conversions: int
    total_purchases: int
    total_spent: float

class TransactionResponse(BaseModel):
    """Response model for transaction history"""
    id: UUID
    type: Literal["purchase", "usage"]
    amount: int  # credits for purchase, 1 for usage
    created_at: datetime
    status: str
    description: str
    package: Optional[str] = None  # Only for purchases

# Pricing Models
class PricingPlan(BaseModel):
    """Pricing plan model"""
    id: str
    name: str
    credits: int
    price: float
    price_per_credit: float
    description: str
    popular: bool = False

class PricingResponse(BaseModel):
    """Response model for pricing endpoint"""
    plans: list[PricingPlan]
    currency: str = "USD"
    price_per_credit: float = 0.15

# Enum for plans
from enum import Enum

class PlanType(str, Enum):
    FREE = "free"
    STARTER = "starter"
    BASIC = "basic"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

# Enum for transaction status
class TransactionStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"