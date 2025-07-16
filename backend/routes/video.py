
from fastapi import APIRouter, File, UploadFile, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
import shutil
import os
import uuid
import time
import glob
from sqlalchemy.orm import Session
from database import SessionLocal, PredictionResultDB
from services import get_scene_graph_from_video_async
from models.scene_graph import PredictionResult
from config.credit_usage import FeatureType, get_credit_cost
from supabase import create_client, Client

# Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Import credit checking function
from routes.generate_code import check_and_use_credit

router = APIRouter()

# Ensure the upload directory exists
UPLOAD_DIRECTORY = "/tmp/videos"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

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

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class SceneGraphRequest(BaseModel):
    userId: str

class SceneGraphResponse(BaseModel):
    prediction_id: str
    creditsUsed: int
    creditsRemaining: int

@router.post("/api/scene-graph", response_model=SceneGraphResponse)
async def scene_graph(
    userId: str,
    file: UploadFile = File(...), 
    background_tasks: BackgroundTasks = BackgroundTasks(), 
    db: Session = Depends(get_db)
):
    """
    Accepts a video file and starts the scene graph generation process.
    """
    if not userId:
        raise HTTPException(status_code=401, detail="User ID required")

    # Check and use credits for video to scene graph feature
    credit_success, credit_message, remaining_credits = check_and_use_credit(
        user_id=userId,
        model="Replicate-YOLO",
        stack="video_processing",
        input_mode="video",
        feature_type=FeatureType.VIDEO_TO_SCENE_GRAPH
    )

    if not credit_success:
        raise HTTPException(status_code=402, detail=f"Credit check failed: {credit_message}")

    # Clean up old files before processing new ones
    cleanup_old_files(UPLOAD_DIRECTORY, max_age_hours=24)
    
    prediction_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Create a new entry in the database
        db_prediction = PredictionResultDB(prediction_id=prediction_id, status="starting")
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)

        background_tasks.add_task(get_scene_graph_from_video_async, prediction_id, file_path, db)

        credit_cost = get_credit_cost(FeatureType.VIDEO_TO_SCENE_GRAPH)
        
        return SceneGraphResponse(
            prediction_id=prediction_id,
            creditsUsed=credit_cost,
            creditsRemaining=remaining_credits
        )
    except Exception as e:
        # Clean up the file if an error occurs during initial processing
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/scene-graph/{prediction_id}", response_model=PredictionResult)
async def get_scene_graph_result(prediction_id: str, db: Session = Depends(get_db)):
    """
    Retrieves the result of a scene graph generation task.
    """
    db_prediction = db.query(PredictionResultDB).filter(PredictionResultDB.prediction_id == prediction_id).first()
    if not db_prediction:
        raise HTTPException(status_code=404, detail="Prediction ID not found")
    return db_prediction
