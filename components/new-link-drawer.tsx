"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { User } from "@heroui/user";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { LinkSuccessScreen } from "./link-success-screen";
import { api } from "@/lib/api-client";
import type { Creator, Domain, Link } from "@/types/database";
import { addToast } from "@heroui/toast";

interface NewLinkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type LinkType = "whitehat" | "greyhat" | "blackhat" | null;

interface FormData {
  linkType: LinkType;
  platform: string;
  creator: string;
  domain: string;
  path: string;
  destinationUrl: string;
  title?: string;
  description?: string;
}

const linkTypes = [
  {
    id: "whitehat" as const,
    title: "Whitehat",
    subtitle: "Landing Page",
    description: "Professional landing page with full content display",
    icon: "solar:document-text-bold-duotone",
    color: "primary",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    id: "greyhat" as const,
    title: "Greyhat",
    subtitle: "Age-Gated",
    description: "Age-gated landing page with yes/no verification",
    icon: "solar:shield-warning-bold-duotone",
    color: "warning",
    gradient: "from-warning/20 to-warning/5",
  },
  {
    id: "blackhat" as const,
    title: "Blackhat",
    subtitle: "Direct Link",
    description: "Direct link to destination (bypass landing page)",
    icon: "solar:link-bold-duotone",
    color: "default",
    gradient: "from-default/20 to-default/5",
  },
];

const platforms = [
  { value: "instagram", label: "Instagram", icon: "mdi:instagram" },
  { value: "tiktok", label: "TikTok", icon: "ic:baseline-tiktok" },
  { value: "youtube", label: "YouTube", icon: "mdi:youtube" },
  { value: "twitter", label: "Twitter/X", icon: "mdi:twitter" },
  { value: "onlyfans", label: "OnlyFans", icon: "simple-icons:onlyfans" },
  { value: "fansly", label: "Fansly", icon: "simple-icons:fansly" },
  { value: "patreon", label: "Patreon", icon: "mdi:patreon" },
  { value: "custom", label: "Custom", icon: "solar:link-circle-linear" },
];

// Default domains (always available)
const defaultDomains = [
  "outlink.bio",
  "clickfor.bio",
  "clickfor.links",
  "tapfor.links",
];

const steps = [
  { id: 1, title: "Link Type", description: "Choose link behavior" },
  { id: 2, title: "Platform", description: "Select platform & creator" },
  { id: 3, title: "Domain", description: "Choose or buy domain" },
  { id: 4, title: "Configure", description: "Set path & destination" },
];

export function NewLinkDrawer({
  isOpen,
  onClose,
  onSuccess,
}: NewLinkDrawerProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showBuyDomain, setShowBuyDomain] = React.useState(false);
  const [domainSearch, setDomainSearch] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [createdLinkId, setCreatedLinkId] = React.useState<string | null>(null);
  const [creators, setCreators] = React.useState<Creator[]>([]);
  const [domains, setDomains] = React.useState<Domain[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    linkType: null,
    platform: "",
    creator: "",
    domain: "",
    path: "",
    destinationUrl: "",
    title: "",
    description: "",
  });

  // Fetch creators and domains when drawer opens
  React.useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setIsLoadingData(true);
      const [creatorsData, domainsData] = await Promise.all([
        api.get<Creator[]>("/api/creators"),
        api.get<Domain[]>("/api/domains"),
      ]);
      setCreators(creatorsData);
      setDomains(domainsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      addToast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const availableDomains = React.useMemo(() => {
    return [...defaultDomains, ...domains.map((d) => d.domain)];
  }, [domains]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Find domain_id from the selected domain
      const selectedDomain = domains.find((d) => d.domain === formData.domain);

      const payload = {
        link_type: formData.linkType as "whitehat" | "greyhat" | "blackhat",
        platform: formData.platform,
        creator_id: formData.creator || undefined,
        domain: formData.domain,
        domain_id: selectedDomain?.id || undefined,
        path: formData.path,
        destination_url: formData.destinationUrl,
        title: formData.title || undefined,
        description: formData.description || undefined,
        status: true,
      };

      const newLink = await api.post<Link>("/api/links", payload);
      setCreatedLinkId(newLink.id);

      // Auto-create landing page settings for whitehat links
      if (formData.linkType === "whitehat") {
        try {
          await api.patch(`/api/landing-page/${newLink.id}`, {
            display_name: formData.title || "Profile",
            bio: formData.description || null,
            theme_mode: "dark",
            background_color: "#18181b",
            background_gradient: { start: "#8B5CF6", end: "#EC4899" },
            button_style: "gradient",
            button_color: "primary",
            social_links: [],
            cta_cards: [],
            verified_badge: false,
            verified_badge_style: "chip",
            show_follower_count: false,
            follower_count: 0,
            show_domain_handle: false,
            profile_display_mode: "full",
          });
        } catch (settingsError) {
          console.error("Error creating landing page settings:", settingsError);
          // Don't fail the whole operation if settings creation fails
        }
      }

      // Auto-create greyhat page settings for greyhat links
      if (formData.linkType === "greyhat") {
        try {
          await api.patch(`/api/greyhat-page/${newLink.id}`, {
            warning_title: "18+ Content Warning",
            warning_message: "You must be at least 18 years old to access this content. Please confirm your age to continue.",
            confirm_button_text: "I'm 18 or Older",
            background_color: "#18181b",
            card_background_color: "#27272a",
            button_color: "#EC4899",
            text_color: "#ffffff",
            icon_color: "#EC4899",
          });
        } catch (settingsError) {
          console.error("Error creating greyhat page settings:", settingsError);
          // Don't fail the whole operation if settings creation fails
        }
      }

      setShowSuccess(true);
      onSuccess();
    } catch (error) {
      console.error("Error creating link:", error);
      addToast({
        title: "Error",
        description: "Failed to create link. Please try again.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setCurrentStep(1);
    setShowBuyDomain(false);
    setFormData({
      linkType: null,
      platform: "",
      creator: "",
      domain: "",
      path: "",
      destinationUrl: "",
      title: "",
      description: "",
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.linkType !== null;
      case 2:
        return true; // Platform and creator are optional
      case 3:
        return formData.domain;
      case 4:
        return formData.path && formData.destinationUrl;
      default:
        return false;
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setCurrentStep(1);
    setShowBuyDomain(false);
    setCreatedLinkId(null);
    setFormData({
      linkType: null,
      platform: "",
      creator: "",
      domain: "",
      path: "",
      destinationUrl: "",
      title: "",
      description: "",
    });
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} placement="right" size="lg">
      <DrawerContent>
        {!showSuccess ? (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">Create New Link</h2>
              <p className="text-small text-default-500 font-normal">
                Step {currentStep} of {steps.length}
              </p>
            </DrawerHeader>
            <DrawerBody className="gap-6">
          {isLoadingData ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" label="Loading..." />
            </div>
          ) : (
            <>
          {/* Stepper */}
          <div className="flex flex-col gap-4">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                      step.id < currentStep
                        ? "border-success bg-success text-white"
                        : step.id === currentStep
                          ? "border-primary bg-primary text-white"
                          : "border-default-200 bg-default-100 text-default-400"
                    )}
                  >
                    {step.id < currentStep ? (
                      <Icon icon="solar:check-circle-bold" width={20} />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </div>
                  {step.id < steps.length && (
                    <div
                      className={cn(
                        "w-0.5 h-16 transition-all",
                        step.id < currentStep
                          ? "bg-success"
                          : "bg-default-200"
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <h3
                    className={cn(
                      "font-semibold",
                      step.id <= currentStep
                        ? "text-foreground"
                        : "text-default-400"
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-small text-default-500">
                    {step.description}
                  </p>
                  
                  {/* Step Content */}
                  {step.id === currentStep && (
                    <div className="mt-4">
                      {/* Step 1: Link Type Selection */}
                      {currentStep === 1 && (
                        <div className="grid grid-cols-1 gap-4">
                          {linkTypes.map((type) => (
                            <Card
                              key={type.id}
                              isPressable
                              className={cn(
                                "border-2 transition-all hover:scale-[1.02]",
                                formData.linkType === type.id
                                  ? "border-primary bg-primary/5"
                                  : "border-transparent hover:border-default-200"
                              )}
                              onPress={() =>
                                setFormData({ ...formData, linkType: type.id })
                              }
                            >
                              <CardBody className="gap-3 p-5">
                                <div className="flex items-start gap-4">
                                  <div
                                    className={cn(
                                      "flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br",
                                      type.gradient
                                    )}
                                  >
                                    <Icon
                                      icon={type.icon}
                                      className={`text-${type.color}`}
                                      width={32}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-lg font-bold">
                                        {type.title}
                                      </h4>
                                      {formData.linkType === type.id && (
                                        <Icon
                                          icon="solar:check-circle-bold"
                                          className="text-primary"
                                          width={20}
                                        />
                                      )}
                                    </div>
                                    <p className="text-small text-default-500 font-medium">
                                      {type.subtitle}
                                    </p>
                                    <p className="text-small text-default-400 mt-2">
                                      {type.description}
                                    </p>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Step 2: Platform & Creator */}
                      {currentStep === 2 && (
                        <div className="flex flex-col gap-4">
                          <Select
                            label="Platform"
                            placeholder="Select a platform"
                            selectedKeys={
                              formData.platform ? [formData.platform] : []
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                platform: e.target.value,
                              })
                            }
                            startContent={
                              formData.platform ? (
                                <Icon
                                  icon={
                                    platforms.find(
                                      (p) => p.value === formData.platform
                                    )?.icon || ""
                                  }
                                  width={20}
                                />
                              ) : null
                            }
                          >
                            {platforms.map((platform) => (
                              <SelectItem
                                key={platform.value}
                                value={platform.value}
                                startContent={
                                  <Icon icon={platform.icon} width={20} />
                                }
                              >
                                {platform.label}
                              </SelectItem>
                            ))}
                          </Select>

                          <Select
                            label="Creator"
                            placeholder="Select a creator"
                            selectedKeys={
                              formData.creator ? [formData.creator] : []
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                creator: e.target.value,
                              })
                            }
                          >
                            {creators.map((creator) => (
                              <SelectItem
                                key={creator.id}
                                value={creator.id}
                                textValue={creator.name}
                              >
                                <User
                                  name={creator.name}
                                  description={creator.email}
                                  avatarProps={{
                                    src: creator.avatar,
                                    size: "sm",
                                  }}
                                />
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                      )}

                      {/* Step 3: Domain Selection */}
                      {currentStep === 3 && (
                        <div className="flex flex-col gap-4">
                          <Select
                            label="Domain"
                            placeholder="Select a domain"
                            selectedKeys={formData.domain ? [formData.domain] : []}
                            onChange={(e) =>
                              setFormData({ ...formData, domain: e.target.value })
                            }
                          >
                            {availableDomains.map((domain) => (
                              <SelectItem key={domain} value={domain}>
                                {domain}
                              </SelectItem>
                            ))}
                          </Select>

                          {!showBuyDomain ? (
                            <Button
                              variant="bordered"
                              startContent={
                                <Icon icon="solar:add-circle-linear" width={20} />
                              }
                              onPress={() => setShowBuyDomain(true)}
                            >
                              Buy New Domain
                            </Button>
                          ) : (
                            <Card className="border-2 border-primary">
                              <CardBody className="gap-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">Buy New Domain</h4>
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() => setShowBuyDomain(false)}
                                  >
                                    <Icon icon="solar:close-circle-linear" width={20} />
                                  </Button>
                                </div>
                                <Input
                                  label="Search Domain"
                                  placeholder="example.com"
                                  value={domainSearch}
                                  onChange={(e) => setDomainSearch(e.target.value)}
                                  endContent={
                                    <Button size="sm" color="primary">
                                      Check
                                    </Button>
                                  }
                                />
                                {domainSearch && (
                                  <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                                    <div className="flex items-center gap-2">
                                      <Icon
                                        icon="solar:check-circle-bold"
                                        className="text-success"
                                        width={20}
                                      />
                                      <span className="font-semibold">
                                        {domainSearch} is available!
                                      </span>
                                    </div>
                                    <span className="text-lg font-bold">
                                      $12.99/year
                                    </span>
                                  </div>
                                )}
                                {domainSearch && (
                                  <Button color="success" fullWidth>
                                    Add to Cart
                                  </Button>
                                )}
                                <p className="text-tiny text-default-400">
                                  <Icon
                                    icon="solar:info-circle-linear"
                                    className="inline"
                                    width={14}
                                  />{" "}
                                  Domain will be registered with Namecheap
                                </p>
                              </CardBody>
                            </Card>
                          )}
                        </div>
                      )}

                      {/* Step 4: Path Configuration */}
                      {currentStep === 4 && (
                        <div className="flex flex-col gap-4">
                          <Input
                            label="Path"
                            placeholder="mylink"
                            value={formData.path}
                            onChange={(e) =>
                              setFormData({ ...formData, path: e.target.value })
                            }
                            startContent={
                              <span className="text-default-400">/</span>
                            }
                          />

                          {formData.domain && formData.path && (
                            <div className="p-3 rounded-lg bg-default-100">
                              <p className="text-tiny text-default-500 mb-1">
                                Preview URL
                              </p>
                              <p className="font-mono font-semibold">
                                https://{formData.domain}/{formData.path}
                              </p>
                            </div>
                          )}

                          <Input
                            label="Destination URL"
                            placeholder="https://example.com/destination"
                            value={formData.destinationUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                destinationUrl: e.target.value,
                              })
                            }
                          />

                          {formData.linkType === "whitehat" && (
                            <>
                              <Input
                                label="Page Title (Optional)"
                                placeholder="My Awesome Page"
                                value={formData.title}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    title: e.target.value,
                                  })
                                }
                              />
                              <Input
                                label="Page Description (Optional)"
                                placeholder="Check out my latest content"
                                value={formData.description}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          </>
          )}
        </DrawerBody>
        <DrawerFooter className="gap-2">
          <Button variant="bordered" onPress={handleClose}>
            Cancel
          </Button>
          {currentStep > 1 && (
            <Button variant="flat" onPress={handleBack}>
              Back
            </Button>
          )}
          {currentStep < steps.length ? (
            <Button
              color="primary"
              onPress={handleNext}
              isDisabled={!isStepValid()}
            >
              Next
            </Button>
          ) : (
            <Button
              color="success"
              onPress={handleSubmit}
              isDisabled={!isStepValid() || isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Link"}
            </Button>
          )}
        </DrawerFooter>
        </>
        ) : (
          <DrawerBody>
            <LinkSuccessScreen
              linkUrl={`https://${formData.domain}/${formData.path}`}
              linkId={createdLinkId || ""}
              linkType={formData.linkType as "whitehat" | "greyhat" | "blackhat" | undefined}
              onCreateAnother={handleCreateAnother}
              onClose={handleClose}
            />
          </DrawerBody>
        )}
      </DrawerContent>
    </Drawer>
  );
}

