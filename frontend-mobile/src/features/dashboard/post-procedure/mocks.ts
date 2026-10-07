import type { PostProcedureAlert } from "./types";

export const mockPostProcedureAlerts: PostProcedureAlert[] = [
  ["Rita Almeida", "09873", 129],
  ["Joana Vilela", "09941", 112],
  ["Ana Paula Reis", "10118", 108],
  ["Lourdes Faria", "10256", 102],
  ["Regina Duarte", "10344", 97],
  ["Sueli Braga", "10025", 94],
  ["Tânia Moura", "11408", 89],
].map(([nome, prontuario, diasAtraso], index) => ({
  idPaciente: index + 101,
  nome: nome as string,
  prontuario: prontuario as string,
  status: "POS_PROCEDIMENTO",
  diasAtraso: diasAtraso as number,
  tipoAlerta: "Pós-procedimento",
}));
