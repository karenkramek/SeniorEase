import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";

export type NotificationType = "success" | "error" | "info";

export interface AppNotification {
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notification: AppNotification | null;
  showNotification: (message: string, type?: NotificationType) => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  showNotification: () => console.warn("NotificationProvider não encontrado"),
  clearNotification: () => undefined,
});

export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<AppNotification | null>(null);

  const showNotification = useCallback(
    (message: string, type: NotificationType = "info") => {
      setNotification({ message, type });
    },
    [],
  );

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}