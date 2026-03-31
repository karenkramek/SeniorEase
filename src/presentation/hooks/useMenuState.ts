import { useCallback, useState } from "react";

export function useMenuState() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return {
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
}
