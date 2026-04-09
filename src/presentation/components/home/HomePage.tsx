import { HomeFooter } from "@/presentation/components/home/HomeFooter";
import { HomeHeader } from "@/presentation/components/home/HomeHeader";
import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import React from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";

export function HomePage() {
  const { themeColors } = useTheme();
  const { homepage } = useAppStrings();
  const { width: screenWidth } = useWindowDimensions();

  // Responsive padding based on screen size
  const getPaddingHorizontal = () => {
    if (screenWidth < 768) return Spacing.large; // mobile: 24px
    if (screenWidth < 1024) return Spacing.xlarge; // tablet: 32px
    return 48; // desktop: 48px
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeColors.background,
      }}
    >
      <HomeHeader />

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: themeColors.background,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: getPaddingHorizontal(),
          paddingVertical: Spacing.xlarge,
        }}
      >
        <View
          style={{
            maxWidth: 800,
            width: "100%",
            alignItems: "center",
            gap: Spacing.large,
          }}
        >
          {/* Tagline */}
          <AccessibleText
            type="h1"
            style={{
              color: themeColors.tint,
              textAlign: "center",
              fontWeight: "700",
            }}
            accessibilityLabel="Título principal"
          >
            {homepage.tagline}
          </AccessibleText>

          {/* Description */}
          <AccessibleText
            type="body"
            style={{
              color: themeColors.icon,
              textAlign: "center",
              lineHeight: 28,
            }}
            accessibilityLabel="Descrição do aplicativo"
          >
            {homepage.description}
          </AccessibleText>
        </View>
      </ScrollView>

      <HomeFooter />
    </View>
  );
}
