"use client";

import React, { useState } from "react";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { ModernAudioPlayer } from "./modern-audio-player";
import { CTACardWithMechanisms } from "./ctr-mechanisms/cta-card-with-mechanisms";
import { AgeConfirmationModal } from "./ctr-mechanisms/age-confirmation-modal";
import type { Link, LandingPageSettings } from "@/types/database";

interface LandingPageViewerProps {
  link: Link;
  settings: LandingPageSettings;
  onButtonClick?: () => void;
  isPreview?: boolean; // When true, disables analytics and navigation
}

export function LandingPageViewer({
  link,
  settings,
  onButtonClick,
  isPreview = false,
}: LandingPageViewerProps) {
  const [showingAgeConfirmationFor, setShowingAgeConfirmationFor] = useState<string | null>(null);
  
  const isLightMode = settings.theme_mode === 'light';
  
  // Theme-aware colors
  const themeColors = {
    background: isLightMode ? '#FFFFFF' : '#18181b',
    textPrimary: isLightMode ? '#18181b' : '#ffffff',
    textSecondary: isLightMode ? '#64748b' : '#94a3b8',
    cardBg: isLightMode ? '#f8fafc' : '#27272a',
    border: isLightMode ? '#e2e8f0' : '#3f3f46',
  };

  const getButtonVariant = () => {
    switch (settings.button_style) {
      case "gradient":
        return "solid";
      case "outline":
        return "bordered";
      case "solid":
        return "solid";
      default:
        return "flat";
    }
  };

  const getButtonClass = () => {
    if (settings.button_style === "gradient") {
      return `bg-gradient-to-r from-${settings.button_color}-400 to-${settings.button_color}-600`;
    }
    return "";
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
    
    // Skip analytics and navigation in preview mode
    if (isPreview) {
      return;
    }
    
    // Track analytics
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        link_id: link.id,
        event_type: "click",
      }),
    }).catch(console.error);

    // Redirect to destination
    window.location.href = link.destination_url;
  };

  const isFullMode = settings.profile_display_mode === 'full';

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Blurred background for desktop - only shows on larger screens */}
      {settings.avatar_url && (
        <div 
          className="hidden md:block absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${settings.avatar_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(80px) brightness(0.4)',
            transform: 'scale(1.1)',
          }}
        />
      )}
      
      {/* Mobile-sized container */}
      <div 
        className="relative z-10 w-full md:max-w-md md:min-h-[812px] md:shadow-2xl md:rounded-2xl overflow-y-auto flex flex-col" 
        style={{ backgroundColor: themeColors.background }}
      >
      {/* Full Display Mode - Hero Image */}
      {isFullMode ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[280px] md:h-[320px]"
        >
          {settings.avatar_url ? (
            <>
              {/* Profile Image Container */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={settings.avatar_url}
                  alt={settings.display_name || link.title || "Profile"}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Gradient overlay to blend into page background */}
              <div
                className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${themeColors.background} 100%)`,
                }}
              />
            </>
          ) : (
            <div className="w-full h-full bg-default-100 flex items-center justify-center">
              <Icon
                icon="solar:user-bold-duotone"
                className="w-24 h-24 text-default-300"
              />
            </div>
          )}
        </motion.div>
      ) : (
        /* Avatar Mode - Circular Profile Picture */
        <div className="w-full pt-8" />
      )}

      {/* Content Section */}
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 md:px-8 relative z-10" style={{ marginTop: isFullMode ? '0' : '0' }}>
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center gap-4">
          
          {/* Name and Verification - Show for Full mode in dark area */}
          {isFullMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-col items-center gap-2 mt-4"
            >
              <div className="flex items-center gap-2">
                <h1 
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: themeColors.textPrimary }}
                >
                  {settings.display_name || link.title || "Profile"}
                </h1>
                {settings.verified_badge && (
                  <>
                    {settings.verified_badge_style === 'solid' ? (
                      <Icon
                        icon="solar:verified-check-bold"
                        className="text-primary"
                        width={24}
                      />
                    ) : (
                      <Chip
                        size="sm"
                        color="primary"
                        variant="flat"
                        startContent={<Icon icon="solar:verified-check-bold" width={16} />}
                      >
                        Verified
                      </Chip>
                    )}
                  </>
                )}
              </div>
              {settings.show_domain_handle && (
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  {link.domain}/{link.path}
                </p>
              )}
            </motion.div>
          )}

          {/* Avatar Mode Display */}
          {!isFullMode && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="relative"
            >
              <div
                className="rounded-full p-1"
                style={{
                  background: `linear-gradient(135deg, #0EA5E9, #3B82F6, #6366F1)`,
                }}
              >
                <Avatar
                  src={settings.avatar_url || undefined}
                  alt={settings.display_name || link.title || "Profile"}
                  className="w-32 h-32 text-large border-4"
                  style={{ borderColor: themeColors.background }}
                  showFallback
                  fallback={
                    <Icon
                      icon="solar:user-bold-duotone"
                      className="w-20 h-20 text-default-500"
                    />
                  }
                />
              </div>
            </motion.div>
          )}

          {/* Name and Verification - Avatar mode only */}
          {!isFullMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-2">
                <h1 
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: themeColors.textPrimary }}
                >
                  {settings.display_name || link.title || "Profile"}
                </h1>
                {settings.verified_badge && (
                  <>
                    {settings.verified_badge_style === 'solid' ? (
                      <Icon
                        icon="solar:verified-check-bold"
                        className="text-primary"
                        width={24}
                      />
                    ) : (
                      <Chip
                        size="sm"
                        color="primary"
                        variant="flat"
                        startContent={<Icon icon="solar:verified-check-bold" width={16} />}
                      >
                        Verified
                      </Chip>
                    )}
                  </>
                )}
              </div>
              {settings.show_domain_handle && (
                <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                  {link.domain}/{link.path}
                </p>
              )}
            </motion.div>
          )}

          {/* Social Links */}
          {settings.social_links && settings.social_links.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {settings.social_links.map((social, index) => (
                <Button
                  key={index}
                  as="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  isIconOnly
                  size="sm"
                  variant="flat"
                  className="hover:scale-110 transition-transform"
                >
                  <Icon icon={social.icon} width={20} />
                </Button>
              ))}
            </motion.div>
          )}

          {/* Follower Count - Simple Text */}
          {settings.show_follower_count && settings.follower_count > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="text-center"
            >
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                <span className="font-semibold" style={{ color: themeColors.textPrimary }}>
                  {settings.follower_count.toLocaleString()}
                </span>{" "}
                Total Followers
              </p>
            </motion.div>
          )}

          {/* Voice Note */}
          {settings.voice_note_url && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.3 }}
              className="w-full max-w-sm"
            >
              <ModernAudioPlayer src={settings.voice_note_url} theme={settings.theme_mode} />
            </motion.div>
          )}

          {/* Bio */}
          {settings.bio && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="text-center max-w-sm"
              style={{ color: themeColors.textSecondary }}
            >
              {settings.bio}
            </motion.p>
          )}

          {/* CTA Cards */}
          {settings.cta_cards && settings.cta_cards.length > 0 ? (
            <div className="w-full space-y-3 mt-4">
              {settings.cta_cards
                .sort((a, b) => a.order - b.order)
                .map((card, index) => {
                  const getCardStyle = () => {
                    switch (card.style.type) {
                      case "solid":
                        return {
                          background: card.style.background_color || "#666",
                        };
                      case "gradient":
                        return {
                          background: card.style.background_gradient
                            ? `linear-gradient(135deg, ${card.style.background_gradient.start}, ${card.style.background_gradient.end})`
                            : "linear-gradient(135deg, #667eea, #764ba2)",
                        };
                      case "image":
                        return {
                          backgroundImage: card.style.background_image
                            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${card.style.background_image})`
                            : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        };
                      case "video":
                        return { background: "#000" };
                      default:
                        return {};
                    }
                  };

                  const handleCardClick = () => {
                    // Skip everything in preview mode
                    if (isPreview) {
                      return;
                    }
                    
                    // Check if 18+ confirmation is required
                    if (card.require_18plus) {
                      // Show age confirmation overlay
                      setShowingAgeConfirmationFor(card.id);
                      return;
                    }

                    // Track analytics
                    fetch("/api/analytics/track", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        link_id: link.id,
                        event_type: "click",
                      }),
                    }).catch(console.error);

                    // Redirect to destination
                    window.location.href = card.url;
                  };

                  const handleAgeConfirm = () => {
                    // Track analytics
                    fetch("/api/analytics/track", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        link_id: link.id,
                        event_type: "click",
                      }),
                    }).catch(console.error);

                    // Redirect to destination
                    window.location.href = card.url;
                  };

                  const handleAgeCancel = () => {
                    // Just close the overlay, don't track as confirmed
                    setShowingAgeConfirmationFor(null);
                  };

                  const renderCardContent = () => (
                    <Card
                      isPressable
                      onPress={handleCardClick}
                      className="w-full hover:scale-[1.02] transition-transform shadow-lg relative"
                      style={getCardStyle()}
                    >
                      <CardBody className="p-6 min-h-[120px] flex items-center justify-center relative">
                        {/* Video Background */}
                        {card.style.type === "video" && card.style.background_video && (
                          <video
                            src={card.style.background_video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                          />
                        )}
                        <div className="text-center w-full relative z-10">
                          {/* Logo Style - Now works with all background types */}
                          {card.style.logo_icon && (
                            <div className="mb-2">
                              <Icon
                                icon={card.style.logo_icon}
                                width={36}
                                style={{
                                  color: card.style.logo_color || "#fff",
                                  filter: card.style.type === "image" || card.style.type === "video"
                                    ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                                    : "none",
                                }}
                                className="mx-auto"
                              />
                              {card.style.logo_name && (
                                <p
                                  className="font-bold text-lg mt-1"
                                  style={{
                                    color: card.style.logo_color || "#fff",
                                    textShadow: card.style.type === "image" || card.style.type === "video"
                                      ? "0 2px 4px rgba(0,0,0,0.3)"
                                      : "none",
                                  }}
                                >
                                  {card.style.prefix_text && (
                                    <span className="mr-1">
                                      {card.style.prefix_text}
                                    </span>
                                  )}
                                  {card.style.logo_name}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Title and Description */}
                          <h3
                            className={`text-lg font-semibold ${
                              card.style.type === "image" ||
                              card.style.type === "gradient" ||
                              card.style.type === "solid" ||
                              card.style.type === "video"
                                ? "text-white"
                                : "text-foreground"
                            }`}
                            style={{
                              textShadow: card.style.type === "image" || card.style.type === "video"
                                ? "0 2px 8px rgba(0,0,0,0.5)"
                                : "none",
                            }}
                          >
                            {card.title}
                          </h3>
                          {card.description && (
                            <p
                              className={`text-sm mt-1 ${
                                card.style.type === "image" ||
                                card.style.type === "gradient" ||
                                card.style.type === "solid" ||
                                card.style.type === "video"
                                  ? "text-white/90"
                                  : "text-default-500"
                              }`}
                              style={{
                                textShadow: card.style.type === "image" || card.style.type === "video"
                                  ? "0 1px 4px rgba(0,0,0,0.5)"
                                  : "none",
                              }}
                            >
                              {card.description}
                            </p>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  );

                  // First render card with CTR mechanisms (these reveal first)
                  const cardWithMechanisms = card.ctr_mechanisms ? (
                    <CTACardWithMechanisms
                      card={card}
                      onReveal={() => {
                        // onReveal just reveals the card, doesn't trigger navigation
                        // The actual click will trigger navigation via renderCardContent's onPress
                      }}
                    >
                      {renderCardContent()}
                    </CTACardWithMechanisms>
                  ) : (
                    renderCardContent()
                  );

                  // Then wrap with age confirmation if user clicked and needs verification
                  const finalContent = showingAgeConfirmationFor === card.id && !isPreview ? (
                    <AgeConfirmationModal
                      isOpen={true}
                      onConfirm={handleAgeConfirm}
                      onCancel={handleAgeCancel}
                    >
                      {cardWithMechanisms}
                    </AgeConfirmationModal>
                  ) : (
                    cardWithMechanisms
                  );

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                      className="relative"
                    >
                      {finalContent}
                    </motion.div>
                  );
                })}
            </div>
          ) : (
            // Fallback to default button if no CTA cards
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="w-full px-4"
            >
              <Card
                isPressable
                onPress={handleButtonClick}
                className="w-full hover:scale-[1.02] transition-transform shadow-lg"
              >
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {link.title || "Click here"}
                      </h3>
                      {link.description && (
                        <p className="text-sm text-default-500 mt-1">
                          {link.description}
                        </p>
                      )}
                    </div>
                    <Icon
                      icon="solar:arrow-right-line-duotone"
                      width={24}
                      className="text-default-400 ml-4"
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="mt-8 pb-8 text-center"
          >
            <a
              href="/"
              className="text-sm text-default-400 hover:text-default-600 transition-colors"
            >
              Create your profile
            </a>
          </motion.div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

