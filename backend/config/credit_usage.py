"""
Credit Usage Configuration
=========================

This file defines credit costs for different features based on their computational complexity,
AI model usage, and resource requirements.
"""

from enum import Enum
from typing import Dict, NamedTuple

class FeatureType(str, Enum):
    """Types of features that consume credits"""
    
    # Code Generation Features
    CODE_GENERATION_TEXT = "code_generation_text"
    CODE_GENERATION_IMAGE = "code_generation_image"
    CODE_GENERATION_VIDEO = "code_generation_video"
    CODE_GENERATION_UPDATE = "code_generation_update"
    
    # Video Processing Features
    VIDEO_TO_SCENE_GRAPH = "video_to_scene_graph"
    WEBPAGE_TO_VIDEO = "webpage_to_video"
    IMAGES_TO_VIDEO = "images_to_video"
    
    # Screenshot Features
    URL_SCREENSHOT = "url_screenshot"
    
    # Future Features (for planning)
    BATCH_PROCESSING = "batch_processing"
    API_ACCESS = "api_access"

class CreditCost(NamedTuple):
    """Credit cost configuration for a feature"""
    base_cost: int
    description: str
    complexity_level: str
    ai_models_used: list
    processing_time_estimate: str

# Credit costs for each feature
CREDIT_COSTS: Dict[FeatureType, CreditCost] = {
    
    # === CODE GENERATION FEATURES ===
    
    FeatureType.CODE_GENERATION_TEXT: CreditCost(
        base_cost=1,
        description="Generate code from text description",
        complexity_level="Low",
        ai_models_used=["Claude-4-Sonnet", "GPT-4", "Claude-3.7-Sonnet"],
        processing_time_estimate="10-30 seconds"
    ),
    
    FeatureType.CODE_GENERATION_IMAGE: CreditCost(
        base_cost=2,
        description="Generate code from screenshot/image",
        complexity_level="Medium",
        ai_models_used=["Claude-3.7-Sonnet", "GPT-4-Vision", "Gemini-2.0-Flash"],
        processing_time_estimate="20-60 seconds"
    ),
    
    FeatureType.CODE_GENERATION_VIDEO: CreditCost(
        base_cost=5,
        description="Generate code from video recording",
        complexity_level="High",
        ai_models_used=["Claude-3-Opus"],
        processing_time_estimate="60-180 seconds"
    ),
    
    FeatureType.CODE_GENERATION_UPDATE: CreditCost(
        base_cost=1,
        description="Update existing code with modifications",
        complexity_level="Low",
        ai_models_used=["Claude-4-Sonnet", "GPT-4"],
        processing_time_estimate="10-30 seconds"
    ),
    
    # === VIDEO PROCESSING FEATURES ===
    
    FeatureType.VIDEO_TO_SCENE_GRAPH: CreditCost(
        base_cost=3,
        description="Extract scene graph and objects from video",
        complexity_level="High",
        ai_models_used=["Replicate-YOLO", "Frame-Extraction"],
        processing_time_estimate="30-90 seconds"
    ),
    
    FeatureType.WEBPAGE_TO_VIDEO: CreditCost(
        base_cost=8,
        description="Convert webpage to video presentation",
        complexity_level="Very High",
        ai_models_used=["GPT-4", "DALL-E", "Text-to-Speech"],
        processing_time_estimate="120-300 seconds"
    ),
    
    FeatureType.IMAGES_TO_VIDEO: CreditCost(
        base_cost=2,
        description="Create video from multiple images",
        complexity_level="Medium",
        ai_models_used=["OpenCV-Video-Processing"],
        processing_time_estimate="30-90 seconds"
    ),
    
    # === SCREENSHOT FEATURES ===
    
    FeatureType.URL_SCREENSHOT: CreditCost(
        base_cost=1,
        description="Capture screenshot from URL",
        complexity_level="Low",
        ai_models_used=["ScreenshotOne-API"],
        processing_time_estimate="5-15 seconds"
    ),
    
    # === FUTURE FEATURES ===
    
    FeatureType.BATCH_PROCESSING: CreditCost(
        base_cost=1,  # Per item in batch
        description="Process multiple items in batch",
        complexity_level="Variable",
        ai_models_used=["Depends-on-batch-type"],
        processing_time_estimate="Variable"
    ),
    
    FeatureType.API_ACCESS: CreditCost(
        base_cost=1,  # Per API call
        description="API access to features",
        complexity_level="Variable",
        ai_models_used=["Same-as-feature"],
        processing_time_estimate="Variable"
    ),
}

def get_credit_cost(feature_type: FeatureType) -> int:
    """Get the credit cost for a feature"""
    return CREDIT_COSTS.get(feature_type, CreditCost(1, "Unknown feature", "Unknown", [], "Unknown")).base_cost

def get_feature_info(feature_type: FeatureType) -> CreditCost:
    """Get full information about a feature's credit cost"""
    return CREDIT_COSTS.get(feature_type, CreditCost(1, "Unknown feature", "Unknown", [], "Unknown"))

def get_all_features_info() -> Dict[FeatureType, CreditCost]:
    """Get information about all features and their credit costs"""
    return CREDIT_COSTS.copy()

# Credit multipliers for different conditions
CREDIT_MULTIPLIERS = {
    "priority_processing": 1.5,  # 50% more for priority processing
    "large_file_size": 1.2,     # 20% more for files > 10MB
    "complex_framework": 1.1,   # 10% more for complex frameworks
    "multiple_iterations": 0.8,  # 20% discount for subsequent iterations
}

# Free tier limitations
FREE_TIER_LIMITS = {
    "max_file_size_mb": 5,
    "max_video_duration_seconds": 60,
    "max_batch_size": 3,
    "priority_processing": False,
}

# Feature availability by plan
PLAN_FEATURES = {
    "free": [
        FeatureType.CODE_GENERATION_TEXT,
        FeatureType.CODE_GENERATION_IMAGE,
        FeatureType.URL_SCREENSHOT,
    ],
    "starter": [
        FeatureType.CODE_GENERATION_TEXT,
        FeatureType.CODE_GENERATION_IMAGE,
        FeatureType.CODE_GENERATION_UPDATE,
        FeatureType.URL_SCREENSHOT,
        FeatureType.IMAGES_TO_VIDEO,
    ],
    "basic": [
        FeatureType.CODE_GENERATION_TEXT,
        FeatureType.CODE_GENERATION_IMAGE,
        FeatureType.CODE_GENERATION_VIDEO,
        FeatureType.CODE_GENERATION_UPDATE,
        FeatureType.URL_SCREENSHOT,
        FeatureType.IMAGES_TO_VIDEO,
        FeatureType.VIDEO_TO_SCENE_GRAPH,
    ],
    "professional": [
        # All features
        *list(FeatureType),
    ],
    "enterprise": [
        # All features + API access
        *list(FeatureType),
    ],
}

def is_feature_available(feature_type: FeatureType, plan: str) -> bool:
    """Check if a feature is available for a given plan"""
    plan_features = PLAN_FEATURES.get(plan, [])
    return feature_type in plan_features

def calculate_dynamic_cost(feature_type: FeatureType, **kwargs) -> int:
    """Calculate dynamic credit cost based on various factors"""
    base_cost = get_credit_cost(feature_type)
    
    # Apply multipliers based on conditions
    multiplier = 1.0
    
    if kwargs.get("priority", False):
        multiplier *= CREDIT_MULTIPLIERS["priority_processing"]
    
    if kwargs.get("file_size_mb", 0) > 10:
        multiplier *= CREDIT_MULTIPLIERS["large_file_size"]
    
    if kwargs.get("framework") in ["React Native", "Flutter", "Angular"]:
        multiplier *= CREDIT_MULTIPLIERS["complex_framework"]
    
    if kwargs.get("is_iteration", False):
        multiplier *= CREDIT_MULTIPLIERS["multiple_iterations"]
    
    # Round up to nearest integer
    import math
    return math.ceil(base_cost * multiplier)

# Export for easy access
__all__ = [
    "FeatureType",
    "CreditCost",
    "CREDIT_COSTS",
    "get_credit_cost",
    "get_feature_info",
    "get_all_features_info",
    "calculate_dynamic_cost",
    "is_feature_available",
    "PLAN_FEATURES",
    "FREE_TIER_LIMITS",
]