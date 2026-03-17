import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

// Detecta se está rodando no Expo Go
const isExpoGo = Constants.appOwnership === "expo";

export class UniversalStorageAdapter {
  async getItem(key: string): Promise<string | null> {
    if (isExpoGo) {
      return await SecureStore.getItemAsync(key);
    }
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (isExpoGo) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (isExpoGo) {
      await SecureStore.deleteItemAsync(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  }
}
