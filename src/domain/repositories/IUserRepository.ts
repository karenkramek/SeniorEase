import { User } from "@/domain/entities/User";

export interface IUserRepository {
  get(): Promise<User | null>;
  update(user: User): Promise<User>;
}
