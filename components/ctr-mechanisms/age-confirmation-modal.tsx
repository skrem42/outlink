"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface AgeConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AgeConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: AgeConfirmationModalProps) {
  const [step, setStep] = useState(1);

  const handleFirstConfirm = () => {
    setStep(2);
  };

  const handleFinalConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    setStep(1);
    onCancel();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            {step === 1 ? (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:shield-warning-bold-duotone" width={24} className="text-warning" />
                    <span>Adult Content Warning</span>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 text-center py-4"
                  >
                    <Icon
                      icon="solar:user-id-bold-duotone"
                      width={64}
                      className="mx-auto text-warning"
                    />
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">
                        This content is for adults only
                      </p>
                      <p className="text-sm text-default-500">
                        By continuing, you confirm that you are at least 18 years old
                        and consent to viewing adult content.
                      </p>
                    </div>
                  </motion.div>
                </ModalBody>
                <ModalFooter className="flex-col gap-2">
                  <Button
                    color="primary"
                    onPress={handleFirstConfirm}
                    fullWidth
                    size="lg"
                  >
                    I am 18 or older
                  </Button>
                  <Button
                    variant="light"
                    onPress={onClose}
                    fullWidth
                  >
                    Exit
                  </Button>
                </ModalFooter>
              </>
            ) : (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:check-circle-bold-duotone" width={24} className="text-success" />
                    <span>Final Confirmation</span>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 text-center py-4"
                  >
                    <Icon
                      icon="solar:verified-check-bold-duotone"
                      width={64}
                      className="mx-auto text-success"
                    />
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">
                        Confirm you're ready to proceed
                      </p>
                      <p className="text-sm text-default-500">
                        Please confirm one more time that you understand this is
                        adult content and you are 18 years or older.
                      </p>
                    </div>
                  </motion.div>
                </ModalBody>
                <ModalFooter className="flex-col gap-2">
                  <Button
                    color="success"
                    onPress={handleFinalConfirm}
                    fullWidth
                    size="lg"
                  >
                    Yes, I confirm
                  </Button>
                  <Button
                    variant="light"
                    onPress={onClose}
                    fullWidth
                  >
                    Go Back
                  </Button>
                </ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

