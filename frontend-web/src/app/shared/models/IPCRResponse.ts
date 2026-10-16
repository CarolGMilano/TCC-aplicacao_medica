import { ResultadoPCR } from "./EnumResultadoPCR";
import { TipoHPV } from "./EnumTipoHPV";

export interface IPCRResponse {
  idExame: number,
  idPaciente: number,
  nomePaciente: string,
  nomeMedico: string,
  dataRegistro: string,
  resultado: ResultadoPCR,
  tiposHpv: TipoHPV[],
  observacao: string,
  dataEdicao: string
}