import { Task } from "@/domain/entities/Task";
import { DocumentData } from "firebase/firestore";

export class TaskMapper {
  static toDomain(id: string, data: DocumentData): Task {
    return {
      id,
      userId: data.userId ?? "",
      title: data.title,
      description: data.description,
      dueDate: data.dueDate?.toDate().toISOString(),
      status: data.status,
      createdAt: data.createdAt?.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString(),
    };
  }

  static toFirestore(task: Partial<Task>): DocumentData {
    const firestoreData: DocumentData = {
      userId: task.userId,
      title: task.title,
      description: task.description ?? null,
      status: task.status,
    };
    if (task.dueDate) {
      firestoreData.dueDate = new Date(task.dueDate);
    }
    return firestoreData;
  }
}
