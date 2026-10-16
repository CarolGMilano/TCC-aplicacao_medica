import { Ist } from "./EnumIst";

export interface IHistoricoIstRequest {
  idPaciente: number,
  ist: Ist,
  condilomaHpv: boolean
}