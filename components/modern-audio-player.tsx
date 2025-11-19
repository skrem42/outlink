"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import WaveSurfer from "wavesurfer.js";

interface ModernAudioPlayerProps {
  src: string;
  theme?: 'light' | 'dark';
}

export function ModernAudioPlayer({ src, theme = 'dark' }: ModernAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const isLightMode = theme === 'light';

  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer with theme-aware colors
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: isLightMode ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.2)",
      progressColor: "rgb(59, 130, 246)", // Solid blue to match verified badge
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      height: 32,
      normalize: true,
      backend: "WebAudio",
    });

    wavesurferRef.current = wavesurfer;

    // Load audio
    wavesurfer.load(src);

    // Event listeners
    wavesurfer.on("ready", () => {
      setIsLoading(false);
      setDuration(wavesurfer.getDuration());
    });

    wavesurfer.on("audioprocess", () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      if (wavesurfer) {
        try {
          wavesurfer.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [src, isLightMode]);

  const togglePlay = () => {
    if (!wavesurferRef.current) return;

    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-2xl backdrop-blur-sm"
      style={{ 
        backgroundColor: isLightMode ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Play/Pause Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        disabled={isLoading}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Icon
            icon={isPlaying ? "solar:pause-bold" : "solar:play-bold"}
            width={20}
            className="text-white"
            style={{ marginLeft: isPlaying ? 0 : 2 }}
          />
        )}
      </motion.button>

      {/* Waveform */}
      <div className="flex-1 flex items-center gap-3">
        <div 
          ref={waveformRef} 
          className="flex-1 cursor-pointer"
          style={{ minHeight: "32px" }}
        />
        
        {/* Time Display */}
        <span 
          className="text-xs font-medium tabular-nums min-w-[35px]"
          style={{ color: isLightMode ? '#64748b' : '#94a3b8' }}
        >
          {formatTime(isPlaying ? currentTime : duration)}
        </span>
      </div>
    </div>
  );
}

