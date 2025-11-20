"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";

interface VideoUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export function VideoUploader({
  value,
  onChange,
  label = "Video URL",
}: VideoUploaderProps) {
  const [videoUrl, setVideoUrl] = useState<string>(value || "");
  const [error, setError] = useState<string>("");

  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    setError("");
    
    if (url && !isValidVideoUrl(url)) {
      setError("Please enter a valid video URL (mp4, webm) or YouTube link");
      return;
    }
    
    onChange(url);
  };

  const isValidVideoUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname.toLowerCase();
      
      // Check for direct video file URLs
      if (path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')) {
        return true;
      }
      
      // Check for YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        return true;
      }
      
      // Check for other video platforms
      if (urlObj.hostname.includes('vimeo.com') || 
          urlObj.hostname.includes('streamable.com') ||
          urlObj.hostname.includes('cloudinary.com')) {
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  };

  const handleRemove = () => {
    setVideoUrl("");
    setError("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <Card className="border-2 border-default-300">
        <CardBody className="p-4 space-y-3">
          <Input
            label="Video URL"
            placeholder="https://example.com/video.mp4 or YouTube link"
            value={videoUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            isInvalid={!!error}
            errorMessage={error}
            description="Enter a direct video URL (.mp4, .webm) or YouTube link"
            startContent={<Icon icon="solar:video-library-linear" width={18} />}
          />

          {videoUrl && !error && (
            <>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <Button
                size="sm"
                variant="flat"
                color="danger"
                fullWidth
                onPress={handleRemove}
                startContent={<Icon icon="solar:trash-bin-trash-linear" width={18} />}
              >
                Remove Video
              </Button>
            </>
          )}

          <div className="text-xs text-default-500 space-y-1">
            <p>💡 <strong>Tip:</strong> Host your video on:</p>
            <ul className="list-disc list-inside pl-2 space-y-0.5">
              <li>Cloudinary, Vimeo, or Streamable</li>
              <li>Your own CDN or server</li>
              <li>YouTube (for embeds)</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

