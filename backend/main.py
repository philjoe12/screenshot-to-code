# /root/screenshot-to-code/backend/main.py

# Load environment variables first
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import screenshot, generate_code, home, evals, webpage_to_video
# Import auth and payments directly with the full path
from routes.auth import router as auth_router
from routes.payments import router as payments_router

app = FastAPI(openapi_url=None, docs_url=None, redoc_url=None)

# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routes
app.include_router(generate_code.router)
app.include_router(screenshot.router)
app.include_router(home.router)
app.include_router(evals.router)
app.include_router(webpage_to_video.router, prefix="/api")

# Add new authentication and payment routes with explicit router variables
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(payments_router, prefix="/payments", tags=["payments"])

from fastapi.staticfiles import StaticFiles
app.mount("/video", StaticFiles(directory="/tmp"), name="video")