import { ResultadoCitologia } from "./EnumResultadoCitologia";

export interface ICitologiaResponse {
  idExame: number,
  idPaciente: number,
  nomePaciente: string,
  nomeMedico: string,
  dataRegistro: string,
  resultado: ResultadoCitologia,
  observacao: string,
  dataEdicao: string
}