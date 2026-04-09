import { DomainException } from "./DomainException";

export class TaskPermissionException extends DomainException {
  constructor() {
    super("Tarefa não encontrada ou sem permissão.");
    this.name = "TaskPermissionException";
  }
}
