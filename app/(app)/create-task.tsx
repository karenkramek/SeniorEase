import { TaskForm } from "@/presentation/components/task/TaskForm";
import { useTheme } from "@/presentation/hooks/useTheme";
import { useRouter } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateTaskScreen() {
  const { themeColors } = useTheme();
  const router = useRouter();

  const handleSuccess = () => {
    // Aguarda um pouco para garantir que refreshTasks completou
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      }
    }, 500);
  };

  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[{ flex: 1 }, { backgroundColor: themeColors.background }]}
    >
      <KeyboardAvoidingView
        enabled={Platform.OS === "ios"}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[{ flex: 1 }, { backgroundColor: themeColors.background }]}
      >
        <TaskForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          showScrollView={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
