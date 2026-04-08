import { TaskForm } from "@/presentation/components/TaskForm";
import { useTaskRepository } from "@/presentation/contexts/TaskRepositoryContext";
import { useTheme } from "@/presentation/hooks/useTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from "react-native";
import { Task } from "@/domain/entities/Task";

export default function EditTaskScreen() {
  const { themeColors } = useTheme();
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const taskRepository = useTaskRepository();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!taskId) return;
      const found = await taskRepository.findById(taskId);
      setTask(found);
      setLoading(false);
    };
    load();
  }, [taskId, taskRepository]);

  const handleSuccess = () => {
    if (router.canGoBack()) router.back();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: themeColors.background }}>
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
