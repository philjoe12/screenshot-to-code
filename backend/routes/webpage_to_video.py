


import requests
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.openai_client import stream_openai_response
from llm import Llm
from config import OPENAI_API_KEY
from gtts import gTTS
import os
import json
from image_generation.core import process_tasks
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips
from config.credit_usage import FeatureType, get_credit_cost
from supabase import create_client, Client

# Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Import credit checking function
from routes.generate_code import check_and_use_credit

router = APIRouter()

class WebpageToVideoPayload(BaseModel):
    url: str
    userId: str

@router.post("/webpage-to-video")
async def webpage_to_video(payload: WebpageToVideoPayload):
    try:
        if not payload.userId:
            raise HTTPException(status_code=401, detail="User ID required")

        # Check and use credits for webpage to video feature
        credit_success, credit_message, remaining_credits = check_and_use_credit(
            user_id=payload.userId,
            model="GPT-4-DALL-E",
            stack="video_generation",
            input_mode="url",
            feature_type=FeatureType.WEBPAGE_TO_VIDEO
        )

        if not credit_success:
            raise HTTPException(status_code=402, detail=f"Credit check failed: {credit_message}")

        if not OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is not set.")

        print(f"Attempting to fetch URL: {payload.url}")
        response = requests.get(payload.url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        soup = BeautifulSoup(response.content, "html.parser")
        print("Successfully fetched and parsed URL content.")

        # Extract text
        text = " ".join(soup.stripped_strings)
        print(f"Extracted text: {text[:100]}...") # Log first 100 chars

        # Summarize text using OpenAI
        script_prompt = f"""Summarize the following text into a short video script:

{text}"""
        print("Sending request to OpenAI for script summary...")
        summary_completion = await stream_openai_response(
            messages=[
                {"role": "user", "content": script_prompt}
            ],
            api_key=OPENAI_API_KEY,
            base_url=None,
            callback=lambda x: None,
            model=Llm.GPT_4O_2024_05_13,
        )
        script = summary_completion["code"]
        print(f"Generated script: {script[:100]}...") # Log first 100 chars

        # Generate image prompts from the script
        image_prompts_prompt = f'''Create a list of image prompts for a video based on the following script. Each prompt should describe a single image. Output the prompts as a JSON list of strings. For example: ["A person sitting at a computer.", "A group of people talking."]:

{script}'''
        print("Sending request to OpenAI for image prompts...")
        image_prompts_completion = await stream_openai_response(
            messages=[
                {"role": "user", "content": image_prompts_prompt}
            ],
            api_key=OPENAI_API_KEY,
            base_url=None,
            callback=lambda x: None,
            model=Llm.GPT_4O_2024_05_13,
        )
        image_prompts = json.loads(image_prompts_completion["code"])
        print(f"Generated image prompts: {image_prompts}")

        # Generate images
        print("Generating images...")
        image_urls = await process_tasks(
            prompts=image_prompts,
            api_key=OPENAI_API_KEY,
            base_url=None,
            model="dalle3",
        )
        print(f"Generated image URLs: {image_urls}")

        # Generate audio from the script
        print("Generating audio from script...")
        tts = gTTS(script)
        audio_path = "/tmp/video_audio.mp3"
        tts.save(audio_path)
        print(f"Audio saved to: {audio_path}")

        # Create video from images and audio
        print("Creating video from images and audio...")
        clips = []
        for url in image_urls:
            if url:
                print(f"Fetching image: {url}")
                image_response = requests.get(url)
                image_response.raise_for_status()
                image_name = os.path.basename(url)
                image_path = f"/tmp/{image_name}"
                with open(image_path, "wb") as f:
                    f.write(image_response.content)
                clips.append(ImageClip(image_path).set_duration(len(script) / len(image_prompts)))
        
        if not clips:
            raise ValueError("No image clips were created for the video.")

        video_clip = concatenate_videoclips(clips, method="compose")
        audio_clip = AudioFileClip(audio_path)
        final_clip = video_clip.set_audio(audio_clip)

        video_output_path = "/tmp/output_video.mp4"
        final_clip.write_videofile(video_output_path, fps=24)
        print(f"Video saved to: {video_output_path}")

        credit_cost = get_credit_cost(FeatureType.WEBPAGE_TO_VIDEO)
        
        return {
            "message": "Video generation completed", 
            "video_path": video_output_path,
            "creditsUsed": credit_cost,
            "creditsRemaining": remaining_credits
        }
    except Exception as e:
        print(f"Error during video generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
