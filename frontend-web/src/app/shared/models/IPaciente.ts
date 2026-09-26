import { StatusPaciente } from "./EnumStatusPaciente";

export interface IPaciente {
  idPaciente: number;
  nome: string;
  dataNascimento: string;
  idade: number;
  prontuario: string;
  status: StatusPaciente;
  grupoPrioritario: boolean;
}