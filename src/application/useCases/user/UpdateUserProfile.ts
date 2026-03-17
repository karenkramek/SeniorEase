import { User } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/IUserRepository";

export class UpdateUserProfile {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: User): Promise<User> {
    return this.userRepository.update(user);
  }
}
