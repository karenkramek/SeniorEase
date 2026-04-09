import { Link } from "expo-router";

import { AccessibleButton } from "@/presentation/components/ui/buttons/AccessibleButton";
import { ThemedText } from "@/presentation/components/ui/text/ThemedText";
import { ThemedView } from "@/presentation/components/ui/text/ThemedView";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { sharedStyles } from "@/presentation/theme/sharedStyles";

export default function ModalScreen() {
  const appTexts = useAppStrings();

  return (
    <ThemedView style={sharedStyles.modalContainer}>
      <ThemedText
        type="title"
        accessibilityLabel={appTexts.modalScreen.titleA11y}
      >
        {appTexts.modalScreen.title}
      </ThemedText>
      <Link href="/(app)/(tabs)/tasks" dismissTo asChild>
        <AccessibleButton
          title={appTexts.modalScreen.goHomeButton}
          accessibilityLabel={appTexts.modalScreen.goHomeButtonA11y}
          style={sharedStyles.buttonLink}
        />
      </Link>
    </ThemedView>
  );
}
