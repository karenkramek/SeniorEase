import { DomainException } from "./DomainException";

export class FirestoreException extends DomainException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "FirestoreException";
  }
}
