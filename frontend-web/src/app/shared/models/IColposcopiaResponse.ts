import { Classificacao } from "./EnumClassificacao";
import { JEC } from "./EnumJEC";
import { TipoAchado } from "./EnumTipoAchado";
import { ZT } from "./EnumZT";

export interface IColposcopiaResponse {
  idColposcopia: number,
  idPaciente: number,
  nomePaciente: string,
  nomeMedico: string,
  dataRegistro: string,
  estrogenizacao: boolean,
  jec: JEC,
  zt: ZT,
  lesao: boolean,
  recidiva: boolean,
  grauLesao: TipoAchado | null,
  classificacao: Classificacao | null,
  observacao: string,
  verETratar: boolean,
  verETratarMotivo: string,
  dataEdicao: string
}