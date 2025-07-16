#/root/screenshot-to-code/backend/routes/screenshot.py
import base64
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import httpx
from urllib.parse import urlparse
import os
from supabase import create_client, Client
from config.credit_usage import FeatureType, get_credit_cost

# Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Import credit checking function
from routes.generate_code import check_and_use_credit

router = APIRouter()


def normalize_url(url: str) -> str:
    """
    Normalize URL to ensure it has a proper protocol.
    If no protocol is specified, default to https://
    """
    url = url.strip()
    
    # Parse the URL
    parsed = urlparse(url)
    
    # Check if we have a scheme
    if not parsed.scheme:
        # No scheme, add https://
        url = f"https://{url}"
    elif parsed.scheme in ['http', 'https']:
        # Valid scheme, keep as is
        pass
    else:
        # Check if this might be a domain with port (like example.com:8080)
        # urlparse treats this as scheme:netloc, but we want to handle it as domain:port
        if ':' in url and not url.startswith(('http://', 'https://', 'ftp://', 'file://')):
            # Likely a domain:port without protocol
            url = f"https://{url}"
        else:
            # Invalid protocol
            raise ValueError(f"Unsupported protocol: {parsed.scheme}")
    
    return url


def bytes_to_data_url(image_bytes: bytes, mime_type: str) -> str:
    base64_image = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{base64_image}"


async def capture_screenshot(
    target_url: str, api_key: str, device: str = "desktop"
) -> bytes:
    api_base_url = "https://api.screenshotone.com/take"

    params = {
        "access_key": api_key,
        "url": target_url,
        "full_page": "true",
        "device_scale_factor": "1",
        "format": "png",
        "block_ads": "true",
        "block_cookie_banners": "true",
        "block_trackers": "true",
        "cache": "false",
        "viewport_width": "342",
        "viewport_height": "684",
    }

    if device == "desktop":
        params["viewport_width"] = "1280"
        params["viewport_height"] = "832"

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.get(api_base_url, params=params)
        if response.status_code == 200 and response.content:
            return response.content
        else:
            raise Exception("Error taking screenshot")


class ScreenshotRequest(BaseModel):
    url: str
    apiKey: str
    userId: str  # Add user ID for credit tracking


class ScreenshotResponse(BaseModel):
    url: str
    creditsUsed: int
    creditsRemaining: int


@router.post("/api/screenshot")
async def app_screenshot(request: ScreenshotRequest):
    # Extract the URL from the request body
    url = request.url
    api_key = request.apiKey
    user_id = request.userId

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID required")

    try:
        # Check and use credits for screenshot feature
        credit_success, credit_message, remaining_credits = check_and_use_credit(
            user_id=user_id,
            model="ScreenshotOne-API",
            stack="screenshot",
            input_mode="url",
            feature_type=FeatureType.URL_SCREENSHOT
        )

        if not credit_success:
            raise HTTPException(status_code=402, detail=f"Credit check failed: {credit_message}")

        # Normalize the URL
        normalized_url = normalize_url(url)
        
        # Capture screenshot with normalized URL
        image_bytes = await capture_screenshot(normalized_url, api_key=api_key)

        # Convert the image bytes to a data url
        data_url = bytes_to_data_url(image_bytes, "image/png")

        credit_cost = get_credit_cost(FeatureType.URL_SCREENSHOT)
        
        return ScreenshotResponse(
            url=data_url,
            creditsUsed=credit_cost,
            creditsRemaining=remaining_credits
        )
    except HTTPException:
        raise
    except ValueError as e:
        # Handle URL normalization errors
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        # Handle other errors
        raise HTTPException(status_code=500, detail=f"Error capturing screenshot: {str(e)}")
