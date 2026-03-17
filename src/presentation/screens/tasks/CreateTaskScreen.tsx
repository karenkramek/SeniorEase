import { CreateTask } from "@/application/useCases/task/CreateTask";
import { TaskRepository } from "@/infrastructure/repositories/TaskRepository";
import { UniversalStorageAdapter } from "@/infrastructure/storage/UniversalStorageAdapter";
import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import React, { useState } from "react";

const storage = new UniversalStorageAdapter();
const taskRepository = new TaskRepository(storage);
const createTaskUseCase = new CreateTask(taskRepository);

const CreateTaskScreen: React.FC = () => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState("");
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<{
    open: boolean;
    index: number | null;
  }>({ open: false, index: null });

  const handleAddStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, newStep]);
      setNewStep("");
    }
  };

  const handleRemoveStep = (index: number) => {
    setShowRemoveConfirm({ open: true, index });
  };

  const confirmRemoveStep = () => {
    if (showRemoveConfirm.index !== null) {
      setSteps(steps.filter((_, i) => i !== showRemoveConfirm.index));
    }
    setShowRemoveConfirm({ open: false, index: null });
  };

  const cancelRemoveStep = () => {
    setShowRemoveConfirm({ open: false, index: null });
  };

  const handleCreateTask = async () => {
    if (!title.trim()) return;
    await createTaskUseCase.execute({
      title,
      dueDate: dueDate || undefined,
    });
    // Navegar para TaskListScreen ou limpar campos
  };

  return (
    <div style={{ padding: 24 }}>
      <AccessibleText type="h1">Criar nova tarefa</AccessibleText>
      <div style={{ margin: "16px 0" }}>
        <AccessibleText>Título:</AccessibleText>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <AccessibleText>Prazo (opcional):</AccessibleText>
        <input
          type="date"
          onChange={(e) =>
            setDueDate(e.target.value ? new Date(e.target.value) : null)
          }
          style={{ width: "100%", marginBottom: 8 }}
        />
      </div>
      <AccessibleText>Etapas:</AccessibleText>
      <ul>
        {steps.map((step, idx) => (
          <li key={idx}>
            <AccessibleText>{step}</AccessibleText>
            <AccessibleButton
              title="Remover"
              onPress={() => handleRemoveStep(idx)}
            />
          </li>
        ))}
      </ul>
      {/* Modal de confirmação para remover etapa */}
      {showRemoveConfirm.open && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            padding: 16,
            borderRadius: 8,
            position: "absolute",
            zIndex: 10,
          }}
        >
          <AccessibleText type="h2">Remover etapa</AccessibleText>
          <AccessibleText>
            Tem certeza que deseja remover esta etapa?
          </AccessibleText>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <AccessibleButton title="Cancelar" onPress={cancelRemoveStep} />
            <AccessibleButton title="Remover" onPress={confirmRemoveStep} />
          </div>
        </div>
      )}
      <div style={{ margin: "8px 0" }}>
        <input
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          placeholder="Nova etapa"
          style={{ width: "80%" }}
        />
        <AccessibleButton title="+ adicionar etapa" onPress={handleAddStep} />
      </div>
      <AccessibleButton
        title="Criar tarefa"
        onPress={handleCreateTask}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 24,
          marginTop: 16,
        }}
      />
    </div>
  );
};

export default CreateTaskScreen;
