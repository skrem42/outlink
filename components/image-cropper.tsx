"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/toast";

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  aspectRatio?: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ASPECT_RATIOS = [
  { label: "Square (1:1)", value: 1 },
  { label: "Wide (16:9)", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "Tall (3:4)", value: 3 / 4 },
  { label: "Free", value: 0 },
];

export function ImageCropper({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio: initialAspectRatio = 1,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(initialAspectRatio);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropAreaChange = useCallback(
    (croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CropArea
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Canvas is empty");
        }
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      }, "image/jpeg", 0.95);
    });
  };

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
      addToast({
        title: "Error",
        description: "Failed to crop image",
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAspectRatioChange = (value: string) => {
    const ratio = parseFloat(value);
    setAspectRatio(ratio || undefined);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon icon="solar:crop-bold-duotone" width={24} />
                <span>Crop Image</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Cropper Area */}
                <div className="relative w-full h-[400px] bg-default-100 rounded-lg overflow-hidden">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio || undefined}
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onCropComplete={onCropAreaChange}
                    objectFit="contain"
                  />
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  {/* Zoom Slider */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Icon icon="solar:magnifer-zoom-in-linear" width={18} />
                      Zoom: {zoom.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-default-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Aspect Ratio Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Icon icon="solar:size-bold-duotone" width={18} />
                      Aspect Ratio
                    </label>
                    <Select
                      size="sm"
                      selectedKeys={[String(aspectRatio)]}
                      onChange={(e) => handleAspectRatioChange(e.target.value)}
                      classNames={{
                        trigger: "h-10",
                      }}
                    >
                      {ASPECT_RATIOS.map((ratio) => (
                        <SelectItem key={String(ratio.value)} value={String(ratio.value)}>
                          {ratio.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
                  <p className="text-xs text-primary-700 dark:text-primary-300">
                    <Icon
                      icon="solar:info-circle-bold"
                      width={16}
                      className="inline mr-1"
                    />
                    Drag to reposition, use the zoom slider to adjust size
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose} isDisabled={isProcessing}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleCrop}
                isLoading={isProcessing}
                startContent={
                  !isProcessing && <Icon icon="solar:crop-bold" width={18} />
                }
              >
                {isProcessing ? "Processing..." : "Crop Image"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

