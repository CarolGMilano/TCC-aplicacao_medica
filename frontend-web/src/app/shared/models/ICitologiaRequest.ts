import { ResultadoCitologia } from "./EnumResultadoCitologia";

export interface ICitologiaRequest {
  idPaciente: number,
  dataRegistro: string,
  resultado: ResultadoCitologia,
  observacao: string | null
}