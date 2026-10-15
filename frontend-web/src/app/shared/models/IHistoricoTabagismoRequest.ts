import { StatusTabagismo } from "./EnumStatusTabagismo";

export interface IHistoricoTabagismoRequest {
  idPaciente: number,
  cigarrosDia: number | null,
  idadeInicio: number | null,
  idadeFim: number | null,
  fumante: StatusTabagismo
}