"use client";

import React, { useState, useEffect } from "react";
import { Progress } from "@heroui/progress";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface ProgressBarRevealProps {
  durationSeconds: number;
  message: string;
  onReveal: () => void;
  children: React.ReactNode;
}

export function ProgressBarReveal({
  durationSeconds,
  message,
  onReveal,
  children,
}: ProgressBarRevealProps) {
  const [progress, setProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const interval = 50; // Update every 50ms for smooth animation
    const totalSteps = (durationSeconds * 1000) / interval;
    const incrementPerStep = 100 / totalSteps;
    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += incrementPerStep;
      
      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          setIsRevealed(true);
          onReveal();
        }, 300);
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [durationSeconds]); // Removed onReveal from dependencies to prevent infinite loop

  if (isRevealed) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 backdrop-blur-md bg-black/60 z-[5] flex flex-col items-center justify-center px-6 pt-20 pb-12 rounded-xl">
        <motion.div className="text-center space-y-4 w-full max-w-md">
          <Icon
            icon="solar:hourglass-bold-duotone"
            width={56}
            className="text-white mx-auto drop-shadow-lg"
          />
          <div className="space-y-3">
            <p className="text-white font-semibold text-lg drop-shadow-md">{message}</p>
            <Progress
              value={progress}
              className="w-full"
              color="primary"
              size="lg"
            />
            <p className="text-white/80 text-sm drop-shadow-sm">
              {Math.round(progress)}% loaded...
            </p>
          </div>
        </motion.div>
      </div>
      <div className="opacity-30 pointer-events-none">{children}</div>
    </div>
  );
}

