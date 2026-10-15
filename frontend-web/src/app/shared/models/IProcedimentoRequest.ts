import { ResultadoProcedimento } from "./EnumResultadoProcedimento";
import { TipoMargem } from "./EnumTipoMargem";
import { TipoProcedimento } from "./EnumTipoProcedimento";

export interface IProcedimentoRequest {
  idPaciente: number,
  dataRegistro: string,
  tipo: TipoProcedimento,
  qtFragmento: number,
  margemEndocervical: TipoMargem | null,
  margemEctocervical: TipoMargem | null,
  resultado: ResultadoProcedimento,
  observacao: string
}