import type { WithoutReturnAlert } from "./types";

export const mockWithoutReturnAlerts: WithoutReturnAlert[] = [
  ["Cláudia Nunes", "10482", 146],
  ["Marina Souza", "10517", 134],
  ["Sônia Prado", "10664", 121],
  ["Ivone Castro", "10731", 98],
  ["Rosa Meireles", "10809", 87],
  ["Vera Antunes", "10912", 82],
  ["Lívia Martins", "11024", 78],
  ["Camila Rocha", "11108", 72],
  ["Patrícia Alves", "11192", 68],
  ["Juliana Freitas", "11240", 63],
  ["Márcia Lopes", "11302", 57],
  ["Renata Dias", "11376", 52],
].map(([nome, prontuario, diasAtraso], index) => ({
  idPaciente: index + 1,
  nome: nome as string,
  prontuario: prontuario as string,
  status: "AGUARDANDO_PROCEDIMENTO",
  diasAtraso: diasAtraso as number,
  tipoAlerta: "Ver e Tratar",
}));
