"use client";

import React, { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";
import { ImageCropper } from "./image-cropper";
import { addToast } from "@heroui/toast";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "square" | "wide" | "tall";
}

export function ImageUploader({
  value,
  onChange,
  label = "Upload Image",
  aspectRatio = "square",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    wide: "aspect-video",
    tall: "aspect-[3/4]",
  };

  const aspectRatioValues = {
    square: 1,
    wide: 16 / 9,
    tall: 3 / 4,
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      addToast({
        title: "Invalid File Type",
        description: "Please select an image file",
        color: "warning",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        title: "File Too Large",
        description: "File size must be less than 5MB",
        color: "warning",
      });
      return;
    }

    try {
      setUploading(true);

      // Read file as data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const fr = new FileReader();
        fr.onloadend = () => resolve(fr.result as string);
        fr.readAsDataURL(file);
      });

      // Store original image and open cropper
      setOriginalImage(dataUrl);
      setSelectedImage(dataUrl);
      setShowCropper(true);
    } catch (error) {
      console.error("Upload error:", error);
      addToast({
        title: "Error",
        description: "Failed to upload image",
        color: "danger",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    // Compress the image to reduce payload size
    let compressedImage = await compressImage(croppedImage, 1000, 0.85);
    
    // If still too large (>400KB base64), compress more aggressively
    if (compressedImage.length > 400000) {
      compressedImage = await compressImage(croppedImage, 800, 0.75);
    }
    
    // If STILL too large, go even more aggressive
    if (compressedImage.length > 400000) {
      compressedImage = await compressImage(croppedImage, 600, 0.65);
    }
    
    setPreview(compressedImage);
    onChange(compressedImage);
    setShowCropper(false);
    setSelectedImage(null);
  };

  const compressImage = async (dataUrl: string, maxWidth = 1000, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Resize if too large
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with compression
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.src = dataUrl;
    });
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setOriginalImage(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRecrop = () => {
    // Always crop from the original image to preserve quality
    if (originalImage) {
      setSelectedImage(originalImage);
      setShowCropper(true);
    }
  };

  return (
    <>
      <div className="space-y-2">
        {label && <label className="text-sm font-medium">{label}</label>}

        <Card className="border-2 border-dashed border-default-300 hover:border-primary transition-colors">
          <CardBody className="p-4">
          {preview ? (
            <div className="space-y-3">
              <div className={`relative w-full ${aspectClasses[aspectRatio]} rounded-lg overflow-hidden bg-default-100`}>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={handleRecrop}
                  isDisabled={!originalImage}
                  startContent={<Icon icon="solar:crop-bold-duotone" width={18} />}
                >
                  Crop
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => fileInputRef.current?.click()}
                  startContent={<Icon icon="solar:refresh-linear" width={18} />}
                >
                  Change
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
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
                      icon="solar:gallery-add-bold-duotone"
                      width={32}
                      className="text-default-500"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-default-700">
                      Click to upload
                    </p>
                    <p className="text-xs text-default-400 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </>
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardBody>
      </Card>
      </div>

      {/* Image Cropper Modal */}
      {selectedImage && (
        <ImageCropper
          isOpen={showCropper}
          onClose={handleCropCancel}
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
          aspectRatio={aspectRatioValues[aspectRatio]}
        />
      )}
    </>
  );
}
