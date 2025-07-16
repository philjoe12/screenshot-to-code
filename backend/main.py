# /root/screenshot-to-code/backend/main.py

# Load environment variables first
from dotenv import load_dotenv

load_dotenv()

import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes import screenshot, generate_code, home, evals, webpage_to_video, video
# Import auth and payments directly with the full path
from routes.auth import router as auth_router
from routes.payments import router as payments_router
from routes.credit_usage import router as credit_usage_router

# Import database to ensure initialization
import database
import time
import glob

app = FastAPI(openapi_url=None, docs_url=None, redoc_url=None)

def cleanup_old_files(directory: str, max_age_hours: int = 24):
    """Remove files older than max_age_hours from the specified directory"""
    try:
        current_time = time.time()
        files = glob.glob(os.path.join(directory, "*"))
        cleaned_count = 0
        
        for file_path in files:
            if os.path.isfile(file_path):
                file_age = current_time - os.path.getmtime(file_path)
                if file_age > max_age_hours * 3600:  # Convert hours to seconds
                    os.remove(file_path)
                    cleaned_count += 1
                    
        if cleaned_count > 0:
            print(f"Cleaned up {cleaned_count} old files from {directory}")
    except Exception as e:
        print(f"Error during cleanup of {directory}: {str(e)}")

@app.exception_handler(Exception)
async def exception_handler(request, exc):
    import traceback
    print(f"Unhandled exception: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={
            "message": "An internal server error occurred.",
            "detail": str(exc),
            "traceback": traceback.format_exc().splitlines()
        }
    )

# Configure CORS settings
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,https://pix2code.com,https://www.pix2code.com").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

# Add routes
app.include_router(generate_code.router)
app.include_router(screenshot.router)
app.include_router(home.router)
app.include_router(evals.router)
app.include_router(webpage_to_video.router, prefix="/api")
app.include_router(video.router)

# Add new authentication and payment routes with explicit router variables
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(payments_router, prefix="/payments", tags=["payments"])
app.include_router(credit_usage_router, prefix="/api", tags=["credit-usage"])

from pydantic import BaseModel
from typing import List
from video_utils import create_video_from_images

class VideoCreationPayload(BaseModel):
    image_data_list: List[str]
    output_filename: str

@app.post("/create-video")
async def create_video(payload: VideoCreationPayload):
    try:
        # Ensure the videos directory exists
        os.makedirs("/tmp/videos", exist_ok=True)
        
        # Clean up old files before creating new ones
        cleanup_old_files("/tmp/videos", max_age_hours=24)
        
        output_path = f"/tmp/videos/{payload.output_filename}"
        create_video_from_images(payload.image_data_list, output_path)
        return {"message": "Video created successfully", "video_path": output_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.staticfiles import StaticFiles
app.mount("/video", StaticFiles(directory="/tmp/videos"), name="video")

@app.get("/healthcheck")
async def healthcheck():
    return {"status": "ok"}