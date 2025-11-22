"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiEffectProps {
  trigger: boolean;
  duration?: number;
}

export function ConfettiEffect({ trigger, duration = 3000 }: ConfettiEffectProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string }>>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [trigger, duration]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            top: -20,
            left: `${particle.x}%`,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            top: "110%",
            opacity: 0,
            scale: 0,
            rotate: Math.random() * 720 - 360,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: "easeOut",
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  );
}


