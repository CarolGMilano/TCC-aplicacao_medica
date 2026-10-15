import { StatusPaciente } from "./EnumStatusPaciente";

export interface IPacienteEdicaoRequest {
  nome: string,
  dataNascimento: string,
  prontuario: string,
  status: StatusPaciente
}