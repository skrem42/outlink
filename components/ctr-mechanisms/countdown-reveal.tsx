"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface CountdownRevealProps {
  durationSeconds: number;
  message: string;
  onReveal: () => void;
  children: React.ReactNode;
}

export function CountdownReveal({
  durationSeconds,
  message,
  onReveal,
  children,
}: CountdownRevealProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsRevealed(true);
      onReveal();
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]); // Removed onReveal from dependencies to prevent infinite loop

  if (isRevealed) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 backdrop-blur-md bg-black/60 z-[5] flex flex-col items-center justify-center px-4 py-3 rounded-xl">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-center space-y-1.5"
        >
          <Icon
            icon="solar:clock-circle-bold-duotone"
            width={36}
            className="text-white mx-auto drop-shadow-lg"
          />
          <div className="space-y-0.5">
            <p className="text-white font-semibold text-sm drop-shadow-md">{message}</p>
            <motion.div
              key={secondsLeft}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-white drop-shadow-lg"
            >
              {secondsLeft}
            </motion.div>
            <p className="text-white/80 text-xs drop-shadow-sm">
              seconds remaining...
            </p>
          </div>
        </motion.div>
      </div>
      <div className="opacity-30 pointer-events-none">{children}</div>
    </div>
  );
}

