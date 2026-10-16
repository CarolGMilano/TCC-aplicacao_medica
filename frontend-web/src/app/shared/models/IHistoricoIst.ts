import { Ist } from "./EnumIst";

export interface IHistoricoIst {
  idHistorico: number,
  idPaciente: number,
  ist: Ist,
  condilomaHpv: boolean
}