export enum Ist {
  HPV = 'HPV',
  HIV = 'HIV',
  HERPES_GENITAL = 'HERPES_GENITAL',
  TRICOMONIASE = 'TRICOMONIASE',
  GONORREIA = 'GONORREIA',
  CLAMIDIA = 'CLAMIDIA',
  SIFILIS = 'SIFILIS',
  NAO_SABE = 'NAO_SABE',
  NENHUMA = 'NENHUMA'
}

export const IstLabel = {
  [Ist.HPV]: 'HPV',
  [Ist.HIV]: 'HIV',
  [Ist.HERPES_GENITAL]: 'Herpes genital',
  [Ist.TRICOMONIASE]: 'Tricomoníase',
  [Ist.GONORREIA]: 'Gonorreia',
  [Ist.CLAMIDIA]: 'Clamídia',
  [Ist.SIFILIS]: 'Sífilis',
  [Ist.NAO_SABE]: 'Não sabe',
  [Ist.NENHUMA]: 'Nenhuma'
};