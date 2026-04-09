import { DomainException } from "./DomainException";

export class AuthenticationException extends DomainException {
  constructor(message = "Usuário não autenticado.") {
    super(message);
    this.name = "AuthenticationException";
  }
}
