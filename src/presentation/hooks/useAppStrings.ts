import { getStrings } from "@/presentation/i18n/strings";
import React from "react";

export function useAppStrings() {
  return React.useMemo(() => getStrings("pt-BR"), []);
}
