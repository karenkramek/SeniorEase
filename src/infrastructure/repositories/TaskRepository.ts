import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { TaskMapper } from "@/infrastructure/mappers/TaskMapper";
import { auth, db } from "@/lib/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";

const TASKS_COLLECTION = "tasks";

function getCurrentUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado.");
  return uid;
}

export class TaskRepository implements ITaskRepository {
  async create(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ): Promise<Task> {
    try {
      const uid = getCurrentUserId();
      const tasksRef = collection(db, TASKS_COLLECTION);
      const taskToSave = TaskMapper.toFirestore({ ...taskData, userId: uid });
      const docRef = await addDoc(tasksRef, {
        ...taskToSave,
        userId: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: docRef.id,
        ...taskData,
        userId: uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      throw new Error("Erro ao criar tarefa no Firestore", { cause: error });
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      const uid = getCurrentUserId();
      const tasksRef = collection(db, TASKS_COLLECTION);
      const q = query(
        tasksRef,
        where("userId", "==", uid),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) =>
        TaskMapper.toDomain(doc.id, doc.data()),
      );
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      throw new Error("Erro ao buscar tarefas do Firestore");
    }
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const uid = getCurrentUserId();
      const taskRef = doc(db, TASKS_COLLECTION, id);
      const docSnap = await getDoc(taskRef);
      if (docSnap.exists() && docSnap.data().userId === uid) {
        return TaskMapper.toDomain(docSnap.id, docSnap.data());
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar tarefa por ID:", error);
      throw new Error("Erro ao buscar tarefa do Firestore", { cause: error });
    }
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    try {
      const uid = getCurrentUserId();
      const tasksRef = collection(db, TASKS_COLLECTION);
      const q = query(
        tasksRef,
        where("userId", "==", uid),
        where("status", "==", status),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) =>
        TaskMapper.toDomain(doc.id, doc.data()),
      );
    } catch (error) {
      console.error("Erro ao buscar tarefas por status:", error);
      throw new Error("Erro ao buscar tarefas do Firestore", { cause: error });
    }
  }

  async update(task: Task): Promise<Task> {
    try {
      getCurrentUserId(); // garante autenticação
      const taskRef = doc(db, TASKS_COLLECTION, task.id);
      const taskToSave = TaskMapper.toFirestore(task);
      await updateDoc(taskRef, {
        ...taskToSave,
        updatedAt: serverTimestamp(),
      });
      return task;
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      throw new Error("Erro ao atualizar tarefa no Firestore", {
        cause: error,
      });
    }
  }

  async updateStatus(taskId: string, status: TaskStatus): Promise<void> {
    try {
      getCurrentUserId();
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao atualizar status da tarefa:", error);
      throw new Error("Erro ao atualizar status da tarefa no Firestore", {
        cause: error,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const uid = getCurrentUserId();
      const taskRef = doc(db, TASKS_COLLECTION, id);
      // Verifica ownership antes de deletar
      const docSnap = await getDoc(taskRef);
      if (!docSnap.exists() || docSnap.data().userId !== uid) {
        throw new Error("Tarefa não encontrada ou sem permissão.");
      }
      await deleteDoc(taskRef);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Tarefa não encontrada ou sem permissão."
      ) {
        throw error;
      }
      console.error("Erro ao deletar tarefa:", error);
      throw new Error("Erro ao deletar tarefa no Firestore", { cause: error });
    }
  }
}
