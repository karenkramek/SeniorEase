import { Task } from "@/domain/entities/Task";
import { getStrings } from "@/presentation/i18n/strings";
import { getReminderMessage } from "@/presentation/utils/reminder";
import * as Notifications from "expo-notifications";

export interface INotificationService {
  scheduleNotification(task: Task): Promise<string | undefined>;
  cancelNotification(notificationId: string): Promise<void>;
}

export class NotificationService implements INotificationService {
  private readonly strings = getStrings("pt-BR");

  constructor() {
    this.configure();
  }

  private async configure() {
    try {
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          console.warn("Permissão para notificações não concedida.");
        }
      }
    } catch (error) {
      console.error("Erro ao configurar as notificações:", error);
    }
  }

  async scheduleNotification(task: Task): Promise<string | undefined> {
    if (!task.dueDate) {
      return;
    }
    const dueDate = new Date(task.dueDate);
    // Lembrete 1 dia antes
    const triggerDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
    if (triggerDate.getTime() > Date.now()) {
      try {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: this.strings.notifications.reminderTitle,
            body: getReminderMessage(task.title, task.dueDate),
            data: { taskId: task.id },
            sound: true,
            vibrate: [500],
          },
          trigger:
            triggerDate as unknown as Notifications.NotificationTriggerInput,
        });

        return notificationId;
      } catch (error) {
        console.error("Erro ao agendar notificação:", error);
      }
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error("Erro ao cancelar notificação:", error);
    }
  }
}
