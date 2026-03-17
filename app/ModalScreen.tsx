import { Link } from "expo-router";

import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { ThemedText } from "@/presentation/components/ThemedText";
import { ThemedView } from "@/presentation/components/ThemedView";
import { sharedStyles } from "@/presentation/theme/sharedStyles";

export default function ModalScreen() {
  return (
    <ThemedView style={sharedStyles.modalContainer}>
      <ThemedText type="title" accessibilityLabel="Título do modal">
        Este é um modal
      </ThemedText>
      <Link href="/TaskListScreen" dismissTo asChild>
        <AccessibleButton
          title="Ir para a tela inicial"
          accessibilityLabel="Botão para ir para a tela inicial"
          style={sharedStyles.buttonLink}
        />
      </Link>
    </ThemedView>
  );
}
