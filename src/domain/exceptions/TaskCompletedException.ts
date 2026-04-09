import { DomainException } from "./DomainException";

export class TaskCompletedException extends DomainException {
  constructor() {
    super("Não é possível editar uma tarefa concluída.");
    this.name = "TaskCompletedException";
  }
}
