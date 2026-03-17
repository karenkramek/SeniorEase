import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorage } from './IStorage';

export class AsyncStorageAdapter implements IStorage {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
}
