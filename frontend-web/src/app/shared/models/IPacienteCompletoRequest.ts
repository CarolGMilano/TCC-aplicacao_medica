import { StatusPaciente } from './EnumStatusPaciente';

export const metodosContraceptivos = {
  ANTICONCEPCIONAL_ORAL_PROGESTAGENIO_ISOLADO: 'Anticoncepcional oral de progestagênio isolado',
  ANTICONCEPCIONAL_ORAL_COMBINADO: 'Anticoncepcional oral combinado',
  IMPLANTE_ETONOGESTREL: 'Implante de etonogestrel', DIU_HORMONAL: 'DIU hormonal',
  DIU_NAO_HORMONAL: 'DIU não hormonal', LAQUEADURA_TUBARIA: 'Laqueadura tubária',
  ANEL_VAGINAL: 'Anel vaginal', ADESIVO_TRANSDERMICO: 'Adesivo transdérmico',
  PRESERVATIVO: 'Preservativo', NENHUM: 'Nenhum'
} as const;
export const tiposIst = {
  HPV: 'HPV', HIV: 'HIV', HERPES_GENITAL: 'Herpes genital', TRICOMONIASE: 'Tricomoníase',
  GONORREIA: 'Gonorreia', CLAMIDIA: 'Clamídia', SIFILIS: 'Sífilis', NAO_SABE: 'Não sabe', NENHUMA: 'Nenhuma'
} as const;
export type MetodoContraceptivo = keyof typeof metodosContraceptivos;
export type TipoIst = keyof typeof tiposIst;
export type StatusFumante = 'FUMANTE' | 'NAO_FUMANTE' | 'EX_FUMANTE';
export interface IPacienteCompletoRequest {
  paciente: { nome: string; dataNascimento: string; prontuario: string; status: StatusPaciente };
  dadosGinecoObstetricos: { numGestacao: number; numPartoNormal: number; numCesariana: number; numAborto: number; menarca: number; menopausa: number | null };
  saudeSexual: { sexarca: number; mac: MetodoContraceptivo; numParceiros: number; vvs: boolean };
  historicoTabagismo: { fumante: StatusFumante; cigarrosDia: number | null; idadeInicio: number | null; idadeFim: number | null };
  historicoIst: { ist: TipoIst; condilomaHpv: boolean | null }[];
}
