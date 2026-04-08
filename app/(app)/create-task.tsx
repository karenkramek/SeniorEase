import { CreateTaskForm } from "@/presentation/components/CreateTaskForm";
import { useTheme } from "@/presentation/hooks/useTheme";
import { useRouter } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform
} from "react-native";

export default function CreateTaskScreen() {
  const { themeColors } = useTheme();
  const router = useRouter();

  const handleSuccess = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[{ flex: 1 }, { backgroundColor: themeColors.background }]}
    >
      <CreateTaskForm onSuccess={handleSuccess} onCancel={handleCancel} showScrollView={true} />
    </KeyboardAvoidingView>
  );
}
