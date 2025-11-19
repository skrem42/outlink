"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

interface LinkSuccessScreenProps {
  linkUrl: string;
  linkId: string;
  linkType?: "whitehat" | "greyhat" | "blackhat";
  onCreateAnother: () => void;
  onClose: () => void;
}

export function LinkSuccessScreen({
  linkUrl,
  linkId,
  linkType,
  onCreateAnother,
  onClose,
}: LinkSuccessScreenProps) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(linkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewAnalytics = () => {
    router.push(`/dashboard/analytics?link=${linkId}`);
    onClose();
  };

  const handleCustomize = () => {
    router.push(`/dashboard/links/customize/${linkId}`);
    onClose();
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Success Icon */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
        <Icon
          icon="solar:check-circle-bold"
          className="text-success"
          width={64}
        />
      </div>

      {/* Success Message */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Link Created Successfully!</h2>
        <p className="text-default-500">
          Your link is now live and ready to share
        </p>
      </div>

      {/* Link Display Card */}
      <Card className="w-full border-2 border-primary">
        <CardBody className="gap-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-tiny text-default-500 mb-1">Your Link</p>
              <p className="font-mono font-semibold text-primary truncate">
                {linkUrl}
              </p>
            </div>
            <Button
              isIconOnly
              color={copied ? "success" : "primary"}
              variant="flat"
              onPress={handleCopy}
            >
              <Icon
                icon={
                  copied
                    ? "solar:check-circle-bold"
                    : "solar:copy-linear"
                }
                width={20}
              />
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* QR Code Placeholder */}
      <Card className="w-full">
        <CardBody className="items-center gap-3 p-6">
          <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-default-100 border-2 border-dashed border-default-300">
            <div className="text-center">
              <Icon
                icon="solar:qr-code-linear"
                className="text-default-400 mx-auto mb-2"
                width={48}
              />
              <p className="text-small text-default-400">QR Code</p>
              <p className="text-tiny text-default-300">Coming Soon</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Social Share Buttons */}
      <div className="w-full">
        <p className="text-small text-default-500 mb-3 text-center">
          Share on Social Media
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          <Button
            isIconOnly
            variant="flat"
            color="default"
            className="bg-[#1DA1F2]/10 text-[#1DA1F2]"
          >
            <Icon icon="mdi:twitter" width={20} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="default"
            className="bg-[#1877F2]/10 text-[#1877F2]"
          >
            <Icon icon="mdi:facebook" width={20} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="default"
            className="bg-[#E4405F]/10 text-[#E4405F]"
          >
            <Icon icon="mdi:instagram" width={20} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="default"
            className="bg-[#25D366]/10 text-[#25D366]"
          >
            <Icon icon="mdi:whatsapp" width={20} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="default"
            className="bg-[#0077B5]/10 text-[#0077B5]"
          >
            <Icon icon="mdi:linkedin" width={20} />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full mt-4">
        {linkType === "whitehat" && (
          <Button
            color="secondary"
            size="lg"
            fullWidth
            startContent={<Icon icon="solar:palette-bold-duotone" width={20} />}
            onPress={handleCustomize}
          >
            Customize Landing Page
          </Button>
        )}
        <Button
          color="primary"
          size="lg"
          fullWidth
          startContent={<Icon icon="solar:chart-linear" width={20} />}
          onPress={handleViewAnalytics}
        >
          View Analytics
        </Button>
        <Button
          variant="bordered"
          size="lg"
          fullWidth
          startContent={<Icon icon="solar:add-circle-linear" width={20} />}
          onPress={onCreateAnother}
        >
          Create Another Link
        </Button>
        <Button
          variant="light"
          size="lg"
          fullWidth
          onPress={onClose}
        >
          Back to Links
        </Button>
      </div>
    </div>
  );
}

