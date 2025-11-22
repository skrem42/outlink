"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface AgeConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

export function AgeConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  children,
}: AgeConfirmationModalProps) {
  const [step, setStep] = useState(1);

  const handleFirstConfirm = () => {
    setStep(2);
  };

  const handleFinalConfirm = () => {
    setStep(1);
    onConfirm();
  };

  const handleCancel = () => {
    setStep(1);
    onCancel();
  };

  if (!isOpen) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Blurred background */}
      <div className="pointer-events-none opacity-30">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 z-[5] flex flex-col items-center justify-center px-4 py-3 rounded-xl">
        {step === 1 ? (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center space-y-1.5"
          >
            <Icon
              icon="solar:shield-warning-bold-duotone"
              width={36}
              className="text-warning mx-auto drop-shadow-lg"
            />
            <div className="space-y-0.5">
              <p className="text-white font-semibold text-sm drop-shadow-md">
                Adult Content (18+)
              </p>
              <p className="text-white/90 text-xs drop-shadow-sm leading-tight">
                You must be 18+ to continue
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                color="primary"
                onPress={handleFirstConfirm}
                className="font-bold shadow-lg"
              >
                I'm 18+
              </Button>
              <Button
                size="sm"
                variant="bordered"
                onPress={handleCancel}
                className="font-bold shadow-lg bg-white/10 text-white border-white/20"
              >
                Exit
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-1.5"
          >
            <Icon
              icon="solar:verified-check-bold-duotone"
              width={36}
              className="text-success mx-auto drop-shadow-lg"
            />
            <div className="space-y-0.5">
              <p className="text-white font-semibold text-sm drop-shadow-md">
                Confirm Age
              </p>
              <p className="text-white/90 text-xs drop-shadow-sm leading-tight">
                Click to confirm you're 18+
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                color="success"
                onPress={handleFinalConfirm}
                className="font-bold shadow-lg"
              >
                Yes, Confirm
              </Button>
              <Button
                size="sm"
                variant="bordered"
                onPress={() => setStep(1)}
                className="font-bold shadow-lg bg-white/10 text-white border-white/20"
              >
                Back
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}


