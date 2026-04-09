import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import React from "react";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function HomeFooter() {
  const { themeColors } = useTheme();
  const insets = useSafeAreaInsets();
  const { homepage } = useAppStrings();
  const { width: screenWidth } = useWindowDimensions();

  const currentYear = new Date().getFullYear();
  const copyrightText = homepage.footerCopyright.replace(
    "{year}",
    currentYear.toString(),
  );

  // Responsive padding based on screen size
  const getPaddingHorizontal = () => {
    if (screenWidth < 768) return Spacing.large; // mobile: 24px
    if (screenWidth < 1024) return Spacing.xlarge; // tablet: 32px
    return 48; // desktop: 48px
  };

  return (
    <View
      style={{
        backgroundColor: themeColors.tint,
        borderTopWidth: 1,
        borderTopColor: themeColors.icon,
        paddingTop: Spacing.large,
        paddingBottom: Spacing.large + insets.bottom,
        paddingHorizontal: getPaddingHorizontal(),
      }}
    >
      <View
        style={{
          maxWidth: 1200,
          width: "100%",
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AccessibleText
          type="bodyCompact"
          style={{
            color: "#ffffff",
            textAlign: "center",
          }}
          accessibilityLabel={copyrightText}
        >
          {copyrightText}
        </AccessibleText>
      </View>
    </View>
  );
}
