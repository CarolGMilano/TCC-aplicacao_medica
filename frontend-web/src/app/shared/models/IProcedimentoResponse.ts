import { ResultadoProcedimento } from "./EnumResultadoProcedimento";
import { TipoMargem } from "./EnumTipoMargem";
import { TipoProcedimento } from "./EnumTipoProcedimento";

export interface IProcedimentoResponse {
  idProcedimento: number,
  idPaciente: number,
  nomePaciente: string,
  nomeMedico: string,
  dataRegistro: string,
  tipo: TipoProcedimento,
  qtFragmento: number,
  margemEndocervical: TipoMargem | null,
  margemEctocervical: TipoMargem | null,
  resultado: ResultadoProcedimento,
  observacao: string,
  dataEdicao: string
}