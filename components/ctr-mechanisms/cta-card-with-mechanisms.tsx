"use client";

import React, { useState } from "react";
import { CTACard } from "@/types/database";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { ClickToReveal } from "./click-to-reveal";
import { CountdownReveal } from "./countdown-reveal";
import { ScarcityBadge } from "./scarcity-badge";
import { AccessCodeModal } from "./access-code-modal";
import { BlurOverlay } from "./blur-overlay";
import { ProgressBarReveal } from "./progress-bar-reveal";
import { ConfettiEffect } from "./confetti-effect";
import { motion } from "framer-motion";

interface CTACardWithMechanismsProps {
  card: CTACard;
  onReveal: () => void;
  children: React.ReactNode;
}

export function CTACardWithMechanisms({
  card,
  onReveal,
  children,
}: CTACardWithMechanismsProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(
    card.ctr_mechanisms?.access_code?.enabled || false
  );
  const [showConfetti, setShowConfetti] = useState(false);

  const mechanisms = card.ctr_mechanisms;

  const handleReveal = () => {
    // Trigger confetti if enabled
    if (mechanisms?.visual_effects?.confetti_on_reveal) {
      setShowConfetti(true);
    }

    // Mark as revealed
    setIsRevealed(true);

    // Call the actual reveal callback
    onReveal();
  };

  // Check if access code is required and not yet verified
  if (mechanisms?.access_code?.enabled && showAccessCodeModal) {
    return (
      <>
        <AccessCodeModal
          isOpen={showAccessCodeModal}
          code={mechanisms.access_code.code}
          hint={mechanisms.access_code.hint}
          onSuccess={() => {
            setShowAccessCodeModal(false);
            if (!hasOtherMechanisms()) {
              handleReveal();
            }
          }}
        />
        <div className="opacity-50 pointer-events-none">{children}</div>
      </>
    );
  }

  const hasOtherMechanisms = () => {
    return (
      mechanisms?.click_to_reveal?.enabled ||
      mechanisms?.countdown_timer?.enabled ||
      mechanisms?.blur_preview?.enabled ||
      mechanisms?.progress_bar?.enabled
    );
  };

  // Wrap with appropriate mechanisms
  let content = children;

  // Apply visual effects (pulse, glow)
  if (mechanisms?.visual_effects?.pulse_animation || mechanisms?.visual_effects?.glow_effect) {
    const className = `
      ${mechanisms.visual_effects.pulse_animation ? 'animate-pulse' : ''}
      ${mechanisms.visual_effects.glow_effect ? 'shadow-lg shadow-primary/50' : ''}
    `.trim();

    content = (
      <motion.div
        animate={
          mechanisms.visual_effects.pulse_animation
            ? { scale: [1, 1.02, 1] }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
        className={className}
      >
        {content}
      </motion.div>
    );
  }

  // Apply Progress Bar (outermost time-based reveal)
  if (mechanisms?.progress_bar?.enabled && !isRevealed) {
    content = (
      <ProgressBarReveal
        durationSeconds={mechanisms.progress_bar.duration_seconds}
        message={mechanisms.progress_bar.message}
        onReveal={handleReveal}
      >
        {content}
      </ProgressBarReveal>
    );
  }
  // Apply Countdown Timer
  else if (mechanisms?.countdown_timer?.enabled && !isRevealed) {
    content = (
      <CountdownReveal
        durationSeconds={mechanisms.countdown_timer.duration_seconds}
        message={mechanisms.countdown_timer.message}
        onReveal={handleReveal}
      >
        {content}
      </CountdownReveal>
    );
  }
  // Apply Click to Reveal
  else if (mechanisms?.click_to_reveal?.enabled && !isRevealed) {
    content = (
      <ClickToReveal
        clicksRequired={mechanisms.click_to_reveal.clicks_required}
        buttonText={mechanisms.click_to_reveal.button_text}
        onReveal={handleReveal}
      >
        {content}
      </ClickToReveal>
    );
  }
  // Apply Blur Preview
  else if (mechanisms?.blur_preview?.enabled && !isRevealed) {
    content = (
      <BlurOverlay
        blurAmount={mechanisms.blur_preview.blur_amount}
        teaserText={mechanisms.blur_preview.teaser_text}
        onReveal={handleReveal}
      >
        {content}
      </BlurOverlay>
    );
  }

  // Add scarcity badges and exclusive badge (these go on top, not blocking)
  const hasMultipleBadges = [
    mechanisms?.limited_slots?.enabled,
    mechanisms?.live_viewers?.enabled,
    mechanisms?.exclusive_badge?.enabled
  ].filter(Boolean).length > 1;

  // Don't wrap in additional div - let the Card component handle the boundaries
  return (
    <>
      {mechanisms?.limited_slots?.enabled && (
        <ScarcityBadge
          type="slots"
          count={mechanisms.limited_slots.current}
          total={mechanisms.limited_slots.total}
          message={mechanisms.limited_slots.message}
        />
      )}
      {mechanisms?.live_viewers?.enabled && (
        <ScarcityBadge
          type="viewers"
          count={mechanisms.live_viewers.count}
        />
      )}
      {mechanisms?.exclusive_badge?.enabled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute z-[10] ${
            hasMultipleBadges ? "bottom-2 left-1/2 -translate-x-1/2" : "top-2 left-1/2 -translate-x-1/2"
          }`}
        >
          <Chip
            color="secondary"
            variant="solid"
            size="sm"
            className="font-semibold"
            startContent={<Icon icon="solar:crown-bold" width={14} />}
          >
            {mechanisms.exclusive_badge.text}
          </Chip>
        </motion.div>
      )}
      {content}
      <ConfettiEffect trigger={showConfetti} />
    </>
  );

}

