import { useAuth } from "@/presentation/contexts/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)/tasks" />;
  }

  return <Redirect href="/(auth)/login" />;
}
