import { Task } from "@/domain/entities/Task";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { EditTaskForm } from "@/presentation/components/EditTaskForm";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";

interface EditTaskModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
}

export function EditTaskModal({
  visible,
  task,
  onClose,
}: EditTaskModalProps) {
  const { themeColors, isWeb } = useTheme();
  const appTexts = useAppStrings();
  const strings = appTexts.editTask;

  if (!task) {
    return null;
  }

  const handleSuccess = () => {
    onClose();
  };

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
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: themeColors.background,
              borderRadius: 12,
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
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <EditTaskForm
                task={task}
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
              paddingVertical: Spacing.medium,
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
              paddingBottom: Spacing.large,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <EditTaskForm
              task={task}
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
