


import requests
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from llm import stream_openai_response, Llm
from config import OPENAI_API_KEY
from gtts import gTTS
import os
import json
from image_generation.core import process_tasks
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips

router = APIRouter()

class WebpageToVideoPayload(BaseModel):
    url: str

@router.post("/webpage-to-video")
async def webpage_to_video(payload: WebpageToVideoPayload):
    try:
        response = requests.get(payload.url)
        soup = BeautifulSoup(response.content, "html.parser")

        # Extract text
        text = " ".join(soup.stripped_strings)

        # Summarize text using OpenAI
        script_prompt = f"""Summarize the following text into a short video script:

{text}"""

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

        # Generate image prompts from the script
        image_prompts_prompt = f'''Create a list of image prompts for a video based on the following script. Each prompt should describe a single image. Output the prompts as a JSON list of strings. For example: ["A person sitting at a computer.", "A group of people talking."]:

{script}'''

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

        # Generate images
        image_urls = await process_tasks(
            prompts=image_prompts,
            api_key=OPENAI_API_KEY,
            base_url=None,
            model="dalle3",
        )

        # Generate audio from the script
        tts = gTTS(script)
        audio_path = "/tmp/video_audio.mp3"
        tts.save(audio_path)

        # Create video from images and audio
        clips = []
        for url in image_urls:
            if url:
                image_response = requests.get(url)
                image_name = os.path.basename(url)
                image_path = f"/tmp/{image_name}"
                with open(image_path, "wb") as f:
                    f.write(image_response.content)
                clips.append(ImageClip(image_path).set_duration(len(script) / len(image_prompts)))

        video_clip = concatenate_videoclips(clips, method="compose")
        audio_clip = AudioFileClip(audio_path)
        final_clip = video_clip.set_audio(audio_clip)

        video_output_path = "/tmp/output_video.mp4"
        final_clip.write_videofile(video_output_path, fps=24)

        print(f"Generating video for URL: {payload.url}")
        print(f"Script: {script}")
        print(f"Image Prompts: {image_prompts}")
        print(f"Image URLs: {image_urls}")
        print(f"Audio saved to: {audio_path}")
        print(f"Video saved to: {video_output_path}")

        return {"message": "Video generation completed", "video_path": video_output_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
