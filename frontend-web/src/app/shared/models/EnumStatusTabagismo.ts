export enum StatusTabagismo {
  FUMANTE = 'FUMANTE',
  NAO_FUMANTE = 'NAO_FUMANTE',
  EX_FUMANTE = 'EX_FUMANTE'
}

export const StatusTabagismoLabel = {
  [StatusTabagismo.FUMANTE]: 'Fumante',
  [StatusTabagismo.NAO_FUMANTE]: 'Não fumante',
  [StatusTabagismo.EX_FUMANTE]: 'Ex-fumante'
};