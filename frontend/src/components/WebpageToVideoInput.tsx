
import { useState } from "react";
import { HTTP_BACKEND_URL } from "../config";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "react-hot-toast";

export function WebpageToVideoInput() {
  const [isLoading, setIsLoading] = useState(false);
  const [referenceUrl, setReferenceUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  async function generateVideo() {
    if (!referenceUrl) {
      toast.error("Please enter a URL");
      return;
    }

    if (referenceUrl) {
      try {
        setIsLoading(true);
        setVideoUrl(null); // Clear previous video
        const response = await fetch(`${HTTP_BACKEND_URL}/api/webpage-to-video`, {
          method: "POST",
          body: JSON.stringify({
            url: referenceUrl,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to generate video");
        }

        const res = await response.json();
        setVideoUrl(`${HTTP_BACKEND_URL}/video/${res.video_path.split('/').pop()}`);
      } catch (error) {
        console.error(error);
        toast.error(
          "Failed to generate video. Look at the console and your backend logs for more details."
        );
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="max-w-[90%] min-w-[40%] gap-y-2 flex flex-col">
      <div className="text-gray-500 text-sm">Or generate a video from a URL...</div>
      <Input
        placeholder="Enter URL"
        onChange={(e) => setReferenceUrl(e.target.value)}
        value={referenceUrl}
      />
      <Button
        onClick={generateVideo}
        disabled={isLoading}
        className="bg-slate-400 capture-btn"
      >
        {isLoading ? "Generating..." : "Generate Video"}
      </Button>

      {videoUrl && (
        <div className="mt-4">
          <video controls src={videoUrl} className="w-full" />
          <a href={videoUrl} download="generated_video.mp4" className="mt-2 block text-center text-blue-500 underline">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
}
