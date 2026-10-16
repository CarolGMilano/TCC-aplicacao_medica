import { StatusTabagismo } from "./EnumStatusTabagismo";

export interface IHistoricoTabagismo {
  idHistorico: number,
  idPaciente: number,
  cigarrosDia: number | null,
  idadeInicio: number | null,
  idadeFim: number | null,
  fumante: StatusTabagismo
}