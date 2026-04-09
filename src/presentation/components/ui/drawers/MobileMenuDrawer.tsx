import type { ReactNode } from "react";
import { AnimatedDrawer } from "./AnimatedDrawer";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function MobileMenuDrawer({
  isOpen,
  onClose,
  children,
}: MobileMenuDrawerProps) {
  return (
    <AnimatedDrawer isOpen={isOpen} onClose={onClose} direction="left">
      {children}
    </AnimatedDrawer>
  );
}
