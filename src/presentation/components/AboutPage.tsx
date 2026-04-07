import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import React from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { AccessibleText } from "./AccessibleText";
import { ExternalLink } from "./ExternalLink";
import { HomeFooter } from "./HomeFooter";
import { HomeHeader } from "./HomeHeader";

export function AboutPage() {
  const { themeColors } = useTheme();
  const { about } = useAppStrings();
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
          paddingHorizontal: getPaddingHorizontal(),
          paddingVertical: Spacing.xlarge,
        }}
      >
        <View
          style={{
            maxWidth: 900,
            width: "100%",
            alignSelf: "center",
            gap: Spacing.xlarge,
          }}
        >
          {/* Page Title */}
          <AccessibleText
            type="h1"
            style={{
              color: themeColors.tint,
              fontWeight: "700",
            }}
            accessibilityLabel={about.title}
          >
            {about.title}
          </AccessibleText>

          {/* Introduction */}
          <View style={{ gap: Spacing.large }}>
            <AccessibleText
              type="body"
              style={{
                color: themeColors.text,
                lineHeight: 28,
              }}
              accessibilityLabel="Introdução do projeto"
            >
              {about.intro}
            </AccessibleText>
          </View>

          {/* Project Section */}
          <View style={{ gap: Spacing.medium }}>
            <AccessibleText
              type="h2"
              style={{
                color: themeColors.tint,
                fontWeight: "700",
              }}
              accessibilityLabel={about.projectSection}
            >
              {about.projectSection}
            </AccessibleText>
            <AccessibleText
              type="body"
              style={{
                color: themeColors.text,
                lineHeight: 28,
              }}
              accessibilityLabel="Descrição do projeto"
            >
              {about.projectDescription}
            </AccessibleText>
          </View>

          {/* Features Section */}
          <View style={{ gap: Spacing.medium }}>
            <AccessibleText
              type="h2"
              style={{
                color: themeColors.tint,
                fontWeight: "700",
              }}
              accessibilityLabel={about.features}
            >
              {about.features}
            </AccessibleText>
            <View style={{ gap: Spacing.small }}>
              <AccessibleText
                type="body"
                style={{
                  color: themeColors.text,
                  lineHeight: 26,
                }}
              >
                • {about.feature1}
              </AccessibleText>
              <AccessibleText
                type="body"
                style={{
                  color: themeColors.text,
                  lineHeight: 26,
                }}
              >
                • {about.feature2}
              </AccessibleText>
              <AccessibleText
                type="body"
                style={{
                  color: themeColors.text,
                  lineHeight: 26,
                }}
              >
                • {about.feature3}
              </AccessibleText>
              <AccessibleText
                type="body"
                style={{
                  color: themeColors.text,
                  lineHeight: 26,
                }}
              >
                • {about.feature4}
              </AccessibleText>
            </View>
          </View>

          {/* Getting Started Section */}
          <View style={{ gap: Spacing.medium }}>
            <AccessibleText
              type="h2"
              style={{
                color: themeColors.tint,
                fontWeight: "700",
              }}
              accessibilityLabel={about.gettingStarted}
            >
              {about.gettingStarted}
            </AccessibleText>
            <AccessibleText
              type="body"
              style={{
                color: themeColors.text,
                lineHeight: 28,
              }}
            >
              {about.getStartedSteps}
            </AccessibleText>
          </View>

          {/* GitHub Section */}
          <View style={{ gap: Spacing.medium }}>
            <AccessibleText
              type="h2"
              style={{
                color: themeColors.tint,
                fontWeight: "700",
              }}
              accessibilityLabel={about.githubLabel}
            >
              {about.githubLabel}
            </AccessibleText>
            <ExternalLink
              href={about.githubLink as any}
              accessibilityLabel={about.githubLinkText}
            >
              <AccessibleText
                type="body"
                style={{
                  color: themeColors.tint,
                  fontWeight: "600",
                  textDecorationLine: "underline",
                }}
              >
                {about.githubLinkText}
              </AccessibleText>
            </ExternalLink>
          </View>

          {/* Students/Credits */}
          <View
            style={{
              gap: Spacing.medium,
              marginTop: Spacing.large,
              paddingTop: Spacing.large,
              borderTopWidth: 1,
              borderTopColor: themeColors.icon,
            }}
          >
            <AccessibleText
              type="h2"
              style={{
                color: themeColors.tint,
                fontWeight: "700",
              }}
              accessibilityLabel={about.studentsLabel}
            >
              {about.studentsLabel}
            </AccessibleText>
            <AccessibleText
              type="body"
              style={{
                color: themeColors.text,
                lineHeight: 26,
              }}
            >
              Karen Kramek
            </AccessibleText>
            <AccessibleText
              type="body"
              style={{
                color: themeColors.text,
                lineHeight: 26,
              }}
            >
              Tatiane Gabrielle M. R. da Costa
            </AccessibleText>
            <AccessibleText
              type="body"
              style={{
                color: themeColors.text,
                lineHeight: 26,
              }}
            >
              Fernanda Raquel Campos Jiacinto
            </AccessibleText>
            <AccessibleText
              type="bodyCompact"
              style={{
                color: themeColors.icon,
                marginTop: Spacing.small,
              }}
            >
              Pós-Graduação em Front-End Engineering
            </AccessibleText>
          </View>
        </View>
      </ScrollView>

      <HomeFooter />
    </View>
  );
}
