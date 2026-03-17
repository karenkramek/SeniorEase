import { User } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { IStorage } from "@/infrastructure/storage/IStorage";

const USER_STORAGE_KEY = "user";

export class UserRepository implements IUserRepository {
  constructor(private storage: IStorage) {}

  async get(): Promise<User | null> {
    const userJson = await this.storage.getItem(USER_STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  async update(user: User): Promise<User> {
    await this.storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  }
}
