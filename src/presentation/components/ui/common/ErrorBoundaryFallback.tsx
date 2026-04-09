import { getStrings } from "@/presentation/i18n/strings";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ErrorBoundaryFallbackProps {
  error: Error;
  retry: () => void;
}

export function ErrorBoundaryFallback({ retry }: ErrorBoundaryFallbackProps) {
  const strings = getStrings().errorBoundary;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
        backgroundColor: "#ffffff",
      }}
      accessibilityLiveRegion="assertive"
    >
      <Ionicons
        name="alert-circle-outline"
        size={72}
        color="#ff3b30"
        accessibilityElementsHidden
      />

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#1c1c1e",
          textAlign: "center",
          marginTop: 24,
          marginBottom: 12,
        }}
        accessibilityRole="header"
      >
        {strings.title}
      </Text>

      <Text
        style={{
          fontSize: 17,
          color: "#636366",
          textAlign: "center",
          lineHeight: 26,
          marginBottom: 40,
          maxWidth: 320,
        }}
      >
        {strings.message}
      </Text>

      <TouchableOpacity
        onPress={retry}
        style={{
          backgroundColor: "#007aff",
          paddingVertical: 16,
          paddingHorizontal: 40,
          borderRadius: 12,
          minWidth: 220,
          alignItems: "center",
        }}
        accessibilityRole="button"
        accessibilityLabel={strings.retryA11y}
      >
        <Text
          style={{
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {strings.retryButton}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
