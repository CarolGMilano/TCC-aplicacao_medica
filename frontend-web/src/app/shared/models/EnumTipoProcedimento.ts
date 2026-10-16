export enum TipoProcedimento {
  BIOPSIA = 'BIOPSIA',
  EZT_1 = 'EZT_1',
  EZT_2 = 'EZT_2',
  EZT_3 = 'EZT_3'
}

export const TipoProcedimentoLabel = {
  [TipoProcedimento.BIOPSIA]: 'Biópsia',
  [TipoProcedimento.EZT_1]: 'EZT 1',
  [TipoProcedimento.EZT_2]: 'EZT 2',
  [TipoProcedimento.EZT_3]: 'EZT 3'
};