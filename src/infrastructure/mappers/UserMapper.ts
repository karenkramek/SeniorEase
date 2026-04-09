import { User } from "@/domain/entities/User";
import { User as FirebaseUser } from "firebase/auth";

export class UserMapper {
  static toDomain(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name: firebaseUser.displayName || undefined,
    };
  }
}
