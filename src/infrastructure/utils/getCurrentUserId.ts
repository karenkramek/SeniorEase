import { AuthenticationException } from "@/domain/exceptions";
import { auth } from "@/lib/firebase";

export function getCurrentUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new AuthenticationException();
  return uid;
}
