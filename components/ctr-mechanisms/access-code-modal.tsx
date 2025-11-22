"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";

interface AccessCodeModalProps {
  isOpen: boolean;
  code: string;
  hint?: string;
  onSuccess: () => void;
}

export function AccessCodeModal({
  isOpen,
  code,
  hint,
  onSuccess,
}: AccessCodeModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (inputValue.toLowerCase() === code.toLowerCase()) {
      setError("");
      onSuccess();
    } else {
      setError("Incorrect code. Please try again.");
      setInputValue("");
    }
  };

  return (
    <Modal isOpen={isOpen} isDismissable={false} hideCloseButton>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icon icon="solar:lock-password-bold-duotone" width={24} />
            <span>Enter Access Code</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            <p className="text-sm text-default-500">
              This content is protected. Enter the access code to continue.
            </p>
            {hint && (
              <p className="text-sm text-primary">
                <Icon icon="solar:info-circle-bold" width={16} className="inline mr-1" />
                Hint: {hint}
              </p>
            )}
            <Input
              label="Access Code"
              placeholder="Enter code..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              isInvalid={!!error}
              errorMessage={error}
              autoFocus
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!inputValue}
            fullWidth
          >
            Unlock
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


