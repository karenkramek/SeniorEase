import { AccessibleButton } from "@/presentation/components/ui/buttons/AccessibleButton";
import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HomeHeaderProps {
  compact?: boolean;
}
export function HomeHeader({ compact = false }: HomeHeaderProps) {
  const { themeColors } = useTheme();
  const insets = useSafeAreaInsets();
  const { common, homepage } = useAppStrings();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  // Breakpoint para mobile
  const isMobile = screenWidth < 768;

  // Responsive padding based on screen size
  const getPaddingHorizontal = () => {
    if (screenWidth < 768) return Spacing.large; // mobile: 24px
    if (screenWidth < 1024) return Spacing.xlarge; // tablet: 32px
    return 48; // desktop: 48px
  };

  const navigateHome = () => {
    router.push("/(public)/home");
  };

  const navigateAbout = () => {
    router.push("/(public)/about");
  };

  const navigateLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <View
      style={{
        backgroundColor: themeColors.tint,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.icon,
        paddingTop: insets.top + (compact ? Spacing.small : Spacing.medium),
        paddingBottom: compact ? Spacing.small : Spacing.medium,
        paddingHorizontal: getPaddingHorizontal(),
      }}
    >
      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          width: "100%",
          alignSelf: "center",
          gap: isMobile ? (compact ? Spacing.small : Spacing.medium) : 0,
        }}
      >
        {/* Logo with Icon */}
        {Platform.OS === "web" ? (
          <Pressable
            onPress={navigateHome}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel={`Ir para ${common.appTitle}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Spacing.small,
            }}
          >
            <Ionicons name="finger-print" size={32} color="#ffffff" />
            <AccessibleText
              type="h2"
              style={{
                color: "#ffffff",
                fontWeight: "700",
                textAlign: "left",
                fontSize: compact ? 20 : undefined,
              }}
              accessibilityLabel={common.appTitle}
            >
              {common.appTitle}
            </AccessibleText>
          </Pressable>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Spacing.small,
            }}
          >
            <AccessibleText
              type="h2"
              style={{
                color: "#ffffff",
                fontWeight: "700",
                textAlign: isMobile ? "center" : "left",
                width: isMobile ? "100%" : "auto",
              }}
              accessibilityLabel={common.appTitle}
            >
              {common.appTitle}
            </AccessibleText>
          </View>
        )}

        {/* Navigation Links and Login Button */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: compact ? Spacing.medium : Spacing.large,
            justifyContent: isMobile ? "center" : "flex-end",
            width: isMobile ? "100%" : "auto",
          }}
        >
          {/* Home Link */}
          <Pressable
            onPress={navigateHome}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel={`Ir para ${homepage.headerHome}`}
          >
            <AccessibleText
              type="body"
              style={{
                color: "#ffffff",
                fontWeight: "500",
              }}
            >
              {homepage.headerHome}
            </AccessibleText>
          </Pressable>

          {/* About Link */}
          <Pressable
            onPress={navigateAbout}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel={`Ir para ${homepage.headerAbout}`}
          >
            <AccessibleText
              type="body"
              style={{
                color: "#ffffff",
                fontWeight: "500",
              }}
            >
              {homepage.headerAbout}
            </AccessibleText>
          </Pressable>

          {/* Login Button */}
          <AccessibleButton
            title={homepage.headerLogin}
            onPress={navigateLogin}
            accessibilityLabel={homepage.headerLogin}
            style={{
              paddingHorizontal: Spacing.large,
              paddingVertical: Spacing.small,
              backgroundColor: "#ffffff",
              borderRadius: 8,
            }}
            textColor={themeColors.tint}
          />
        </View>
      </View>
    </View>
  );
}
