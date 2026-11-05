import { StatusPaciente } from "./EnumStatusPaciente";

export interface IPendenciaResponse {
  idPaciente: number,
  nome: string,
  prontuario: string,
  status: StatusPaciente,
  diasAtraso: number,
  tipoAlerta: string
}