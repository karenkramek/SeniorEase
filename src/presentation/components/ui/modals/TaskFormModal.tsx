import { Task } from "@/domain/entities/Task";
import { TaskForm } from "@/presentation/components/task/TaskForm";
import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TaskFormModalProps {
  visible: boolean;
  task?: Task | null; // undefined/null = criar, Task = editar
  onClose: () => void;
  onSuccess?: () => void;
}

export function TaskFormModal({
  visible,
  task,
  onClose,
  onSuccess,
}: TaskFormModalProps) {
  const isEditMode = !!task;
  const { themeColors, isWeb, colorScheme, preferences } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomSafeSpace = Math.max(
    insets.bottom,
    Spacing.xlarge + Spacing.small,
  );
  const appTexts = useAppStrings();
  const strings = isEditMode ? appTexts.editTask : appTexts.createTask;

  const modalBackdropColor = preferences.isHighContrast
    ? "rgba(255,255,255,0.30)"
    : colorScheme === "dark"
      ? "rgba(0,0,0,0.72)"
      : "rgba(0,0,0,0.45)";

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  if (isEditMode && !task) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={isWeb}
      animationType={isWeb ? "fade" : "slide"}
      onRequestClose={onClose}
      accessibilityViewIsModal
      presentationStyle={isWeb ? "overFullScreen" : "fullScreen"}
    >
      {isWeb ? (
        // WEB: Modal centrado com overlay
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: modalBackdropColor,
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: themeColors.background,
              borderRadius: 12,
              borderWidth: preferences.isHighContrast ? 2 : 1,
              borderColor: themeColors.icon,
              maxHeight: "90%",
              width: "100%",
              maxWidth: 600,
              flexDirection: "column",
            }}
          >
            {/* Header do Modal */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: themeColors.icon + "20",
              }}
            >
              <AccessibleText
                type="h2"
                style={{
                  color: themeColors.text,
                  flex: 1,
                }}
                accessibilityLabel={strings.screenLabel}
              >
                {strings.screenLabel}
              </AccessibleText>

              <TouchableOpacity
                onPress={onClose}
                accessible
                accessibilityRole="button"
                accessibilityLabel={appTexts.common.close}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={themeColors.icon}
                  accessibilityElementsHidden
                />
              </TouchableOpacity>
            </View>

            {/* Formulário */}
            <ScrollView
              contentContainerStyle={{
                padding: 20,
                paddingBottom: 32,
              }}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              <TaskForm
                task={task || undefined}
                onSuccess={handleSuccess}
                onCancel={onClose}
                isModal={true}
                showScrollView={false}
              />
            </ScrollView>
          </View>
        </View>
      ) : (
        // APP: Fullscreen como a tela de detalhes
        <View style={{ flex: 1, backgroundColor: themeColors.background }}>
          {/* Header do Modal - similar a task-details */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: Spacing.large,
              paddingTop: insets.top + Spacing.small,
              paddingBottom: Spacing.medium,
              borderBottomWidth: 1,
              borderBottomColor: themeColors.icon + "20",
            }}
          >
            <AccessibleText
              type="h2"
              style={{
                color: themeColors.text,
                flex: 1,
              }}
              accessibilityLabel={strings.screenLabel}
            >
              {strings.screenLabel}
            </AccessibleText>

            <TouchableOpacity
              onPress={onClose}
              accessible
              accessibilityRole="button"
              accessibilityLabel={appTexts.common.close}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons
                name="close"
                size={24}
                color={themeColors.icon}
                accessibilityElementsHidden
              />
            </TouchableOpacity>
          </View>

          {/* Formulário em ScrollView fullscreen */}
          <ScrollView
            contentContainerStyle={{
              padding: Spacing.large,
              paddingBottom: bottomSafeSpace + Spacing.xlarge,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <TaskForm
              task={task || undefined}
              onSuccess={handleSuccess}
              onCancel={onClose}
              isModal={true}
              showScrollView={false}
            />
          </ScrollView>
        </View>
      )}
    </Modal>
  );
}
