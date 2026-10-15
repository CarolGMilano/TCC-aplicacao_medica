export enum TipoHPV {
  HPV_6 = 'HPV_6',
  HPV_11 = 'HPV_11',
  HPV_16 = 'HPV_16',
  HPV_18 = 'HPV_18',
  OUTROS = 'OUTROS'
}

export const TipoHPVLabel = {
  [TipoHPV.HPV_6]: 'HPV 6',
  [TipoHPV.HPV_11]: 'HPV 11',
  [TipoHPV.HPV_16]: 'HPV 16',
  [TipoHPV.HPV_18]: 'HPV 18',
  [TipoHPV.OUTROS]: 'Outros'
};