import { ListTasksByFilter } from "@/application/useCases/task/ListTasksByFilter";
import { Task } from "@/domain/entities/Task";
import { TaskFilter } from "@/domain/enums/TaskFilter";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useTaskRepository } from "@/presentation/contexts/TaskRepositoryContext";
import { formatDate } from "@/presentation/utils/date";
import { FILTER_LABELS } from "@/presentation/utils/filterLabels";
import { getReminderMessage } from "@/presentation/utils/reminder";
import React, { useEffect, useState } from "react";

const TaskListScreen: React.FC = () => {
  const taskRepository = useTaskRepository();
  const listTasksByFilterUseCase = React.useMemo(
    () => new ListTasksByFilter(taskRepository),
    [taskRepository],
  );

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>(TaskFilter.PENDING);

  useEffect(() => {
    const fetchTasks = async () => {
      let filteredTasks: Task[] = [];
      if (filter === TaskFilter.PENDING) {
        filteredTasks = await listTasksByFilterUseCase.execute(
          TaskStatus.PENDING,
        );
      } else if (filter === TaskFilter.COMPLETED) {
        filteredTasks = await listTasksByFilterUseCase.execute(
          TaskStatus.COMPLETED,
        );
      } else if (filter === TaskFilter.UPCOMING) {
        const allTasks = await listTasksByFilterUseCase.execute(
          TaskStatus.PENDING,
        );
        const now = new Date();
        filteredTasks = allTasks.filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return (
            dueDate > now &&
            dueDate < new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
          );
        });
      }
      setTasks(filteredTasks);
    };
    fetchTasks();
  }, [filter, listTasksByFilterUseCase]);

  // Removido bloco de filtragem extra, pois tasks já está filtrado pelo useEffect
  const filteredTasks = tasks;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <AccessibleButton
          title={FILTER_LABELS[TaskFilter.PENDING]}
          onPress={() => setFilter(TaskFilter.PENDING)}
        />
        <AccessibleButton
          title={FILTER_LABELS[TaskFilter.COMPLETED]}
          onPress={() => setFilter(TaskFilter.COMPLETED)}
        />
        <AccessibleButton
          title={FILTER_LABELS[TaskFilter.UPCOMING]}
          onPress={() => setFilter(TaskFilter.UPCOMING)}
        />
      </div>
      <hr />
      <div style={{ margin: "24px 0" }}>
        {filteredTasks.length === 0 ? (
          <AccessibleText>Nenhuma tarefa encontrada.</AccessibleText>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              style={{
                marginBottom: 16,
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <AccessibleText>📌 {task.title}</AccessibleText>
              {task.dueDate && (
                <AccessibleText>
                  Prazo: {formatDate(task.dueDate)}
                </AccessibleText>
              )}
              <AccessibleText>{task.steps.length} etapas</AccessibleText>
              {filter === TaskFilter.UPCOMING && task.dueDate && (
                <AccessibleText>
                  {getReminderMessage(task.title, task.dueDate)}
                </AccessibleText>
              )}
              <AccessibleButton
                title="Ver detalhes"
                onPress={() => {
                  /* Navegar para detalhes */
                }}
              />
            </div>
          ))
        )}
      </div>
      <AccessibleButton
        title="+ Criar nova tarefa"
        onPress={() => {
          /* Navegar para criar nova tarefa */
        }}
        style={{ paddingVertical: 12, paddingHorizontal: 24 }}
      />
    </div>
  );
};

export default TaskListScreen;
