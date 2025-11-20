"use client";

import React, { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { Spinner } from "@heroui/spinner";

interface VideoUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export function VideoUploader({
  value,
  onChange,
  label = "Upload Video",
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      alert("Please select a video file");
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB");
      return;
    }

    try {
      setUploading(true);

      // Read file as data URL for preview
      const dataUrl = await new Promise<string>((resolve) => {
        const fr = new FileReader();
        fr.onloadend = () => resolve(fr.result as string);
        fr.readAsDataURL(file);
      });

      setPreview(dataUrl);
      onChange(dataUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <Card className="border-2 border-dashed border-default-300 hover:border-primary transition-colors">
        <CardBody className="p-4">
          {preview ? (
            <div className="space-y-3">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  src={preview}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  fullWidth
                  onPress={() => fileInputRef.current?.click()}
                  startContent={<Icon icon="solar:refresh-linear" width={18} />}
                >
                  Change
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  fullWidth
                  onPress={handleRemove}
                  startContent={<Icon icon="solar:trash-bin-trash-linear" width={18} />}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-8 flex flex-col items-center justify-center gap-3 hover:bg-default-100 rounded-lg transition-colors"
            >
              {uploading ? (
                <Spinner size="lg" />
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-default-100 flex items-center justify-center">
                    <Icon
                      icon="solar:video-library-bold-duotone"
                      width={32}
                      className="text-default-500"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-default-700">
                      Click to upload video
                    </p>
                    <p className="text-xs text-default-400 mt-1">
                      MP4, WebM up to 50MB
                    </p>
                  </div>
                </>
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardBody>
      </Card>
    </div>
  );
}

