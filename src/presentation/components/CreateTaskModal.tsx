import { AccessibleText } from "@/presentation/components/AccessibleText";
import { CreateTaskForm } from "@/presentation/components/CreateTaskForm";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ visible, onClose }: CreateTaskModalProps) {
  const { themeColors } = useTheme();
  const appTexts = useAppStrings();
  const strings = appTexts.createTask;

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: themeColors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "90%",
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
            <CreateTaskForm
              onSuccess={handleSuccess}
              isModal={true}
              showScrollView={false}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
