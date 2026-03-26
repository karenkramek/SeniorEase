import { User } from "@/domain/entities/User";
import { User as FirebaseUser } from "firebase/auth";

export class UserMapper {
  static toDomain(firebaseUser: FirebaseUser): User {
    return new User(
      firebaseUser.uid,
      firebaseUser.email!,
      firebaseUser.displayName || undefined,
    );
  }
}
