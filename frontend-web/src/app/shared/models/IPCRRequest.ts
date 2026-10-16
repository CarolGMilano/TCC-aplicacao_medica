import { ResultadoPCR } from "./EnumResultadoPCR";
import { TipoHPV } from "./EnumTipoHPV";

export interface IPCRRequest {
  idPaciente: number,
  dataRegistro: string,
  resultado: ResultadoPCR,
  tiposHpv: TipoHPV[],
  observacao: string
}