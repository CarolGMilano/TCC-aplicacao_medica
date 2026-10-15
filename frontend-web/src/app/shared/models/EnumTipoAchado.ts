export enum TipoAchado {
  ACHADO_MAIOR = 'ACHADO_MAIOR',
  ACHADO_MENOR = 'ACHADO_MENOR',
  INVASAO = 'INVASAO'
}

export const TipoAchadoLabel = {
  [TipoAchado.ACHADO_MAIOR]: 'Achado maior',
  [TipoAchado.ACHADO_MENOR]: 'Achado menor',
  [TipoAchado.INVASAO]: 'Invasão'
};