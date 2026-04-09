import { Task } from "@/domain/entities/Task";
import { TaskForm } from "@/presentation/components/task/TaskForm";
import { useTaskRepository } from "@/presentation/contexts/TaskRepositoryContext";
import { useTheme } from "@/presentation/hooks/useTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";

export default function EditTaskScreen() {
  const { themeColors } = useTheme();
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const taskRepository = useTaskRepository();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    const load = async () => {
      try {
        const found = await taskRepository.findById(taskId);
        setTask(found);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]); // taskRepository is a stable singleton from context

  const handleSuccess = () => {
    if (router.canGoBack()) router.back();
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: themeColors.background,
        }}
      >
        <ActivityIndicator size="large" color={themeColors.tint} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: themeColors.background }}
    >
      <TaskForm
        task={task ?? undefined}
        onSuccess={handleSuccess}
        onCancel={handleSuccess}
        showScrollView={true}
      />
    </KeyboardAvoidingView>
  );
}
