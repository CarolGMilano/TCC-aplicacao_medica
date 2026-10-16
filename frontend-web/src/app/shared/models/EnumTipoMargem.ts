export enum TipoMargem {
  LIVRE = 'LIVRE',
  COMPROMETIDA = 'COMPROMETIDA',
  COINCIDENTE = 'COINCIDENTE'
}

export const TipoMargemLabel = {
  [TipoMargem.LIVRE]: 'Livre',
  [TipoMargem.COMPROMETIDA]: 'Comprometida',
  [TipoMargem.COINCIDENTE]: 'Coincidente'
};