import { DomainException } from "./DomainException";

export class TaskNotFoundException extends DomainException {
  constructor() {
    super("Tarefa não encontrada.");
    this.name = "TaskNotFoundException";
  }
}
