import { useNotification } from "@/presentation/contexts/NotificationContext";
import { useState } from "react";

interface ConfirmationOptions {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  iconName?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  isDangerous?: boolean;
}

interface SuccessOptions {
  message: string;
  description?: string;
  duration?: number;
}

export function useConfirmationFlow() {
  const { showNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);

  const showConfirmation = (opts: ConfirmationOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await options?.onConfirm?.();
    } catch (error) {
      console.error("Erro ao confirmar:", error);
      showNotification(
        "Ocorreu um erro ao processar sua ação",
        "error",
        5000,
        "Tente novamente mais tarde",
      );
    } finally {
      setIsPending(false);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const showSuccess = (opts: string | SuccessOptions) => {
    if (typeof opts === "string") {
      showNotification(opts, "success", 5000);
    } else {
      showNotification(
        opts.message,
        "success",
        opts.duration ?? 5000,
        opts.description,
      );
    }
  };

  const showError = (
    opts: string | { message: string; description?: string },
  ) => {
    if (typeof opts === "string") {
      showNotification(opts, "error", 5000);
    } else {
      showNotification(opts.message, "error", 5000, opts.description);
    }
  };

  return {
    isOpen,
    isPending,
    options,
    showConfirmation,
    handleConfirm,
    handleCancel,
    showSuccess,
    showError,
  };
}
