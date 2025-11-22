"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface BlurOverlayProps {
  blurAmount: number;
  teaserText: string;
  onReveal: () => void;
  children: React.ReactNode;
}

export function BlurOverlay({
  blurAmount,
  teaserText,
  onReveal,
  children,
}: BlurOverlayProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    onReveal();
  };

  if (isRevealed) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        style={{ filter: `blur(${blurAmount}px)` }}
        className="pointer-events-none"
      >
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-[5] flex flex-col items-center justify-center px-4 py-3 rounded-xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-1.5"
        >
          <Icon
            icon="solar:eye-bold-duotone"
            width={36}
            className="text-white mx-auto drop-shadow-lg"
          />
          <div className="space-y-0.5">
            <p className="text-white font-semibold text-sm drop-shadow-md">{teaserText}</p>
            <p className="text-white/80 text-xs drop-shadow-sm">
              Click below to reveal
            </p>
          </div>
          <Button
            size="sm"
            color="primary"
            onPress={handleReveal}
            className="font-bold shadow-lg"
            startContent={<Icon icon="solar:eye-linear" width={16} />}
          >
            Reveal Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

