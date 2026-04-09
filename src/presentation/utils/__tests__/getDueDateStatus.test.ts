/// <reference types="jest" />
import { getDueDateStatus } from "../format";

/**
 * Datas são construídas relativamente ao "hoje" para que os testes
 * não dependam de uma data fixa e continuem passando sempre.
 */
function daysFromNow(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  // Zera o horário para evitar variações de timezone no comparador
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

describe("getDueDateStatus", () => {
  it("retorna null quando dueDate é undefined", () => {
    expect(getDueDateStatus(undefined)).toBeNull();
  });

  it("retorna null para string vazia", () => {
    expect(getDueDateStatus("")).toBeNull();
  });

  it("retorna null para string inválida", () => {
    expect(getDueDateStatus("data-invalida")).toBeNull();
  });

  it('retorna "overdue" para data no passado', () => {
    expect(getDueDateStatus(daysFromNow(-1))).toBe("overdue");
  });

  it('retorna "today" para data de hoje', () => {
    expect(getDueDateStatus(daysFromNow(0))).toBe("today");
  });

  it('retorna "soon" para datas até 6 dias à frente', () => {
    expect(getDueDateStatus(daysFromNow(1))).toBe("soon");
    expect(getDueDateStatus(daysFromNow(6))).toBe("soon");
  });

  it("retorna null para datas com mais de 6 dias no futuro", () => {
    expect(getDueDateStatus(daysFromNow(7))).toBeNull();
    expect(getDueDateStatus(daysFromNow(30))).toBeNull();
  });
});
