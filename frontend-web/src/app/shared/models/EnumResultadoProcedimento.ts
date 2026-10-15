export enum ResultadoProcedimento {
  NIC_1 = 'NIC_1',
  NIC_2 = 'NIC_2',
  NIC_3 = 'NIC_3',
  ADENOCARCINOMA_IN_SITU = 'ADENOCARCINOMA_IN_SITU',
  MICROINVASOR_IA1 = 'MICROINVASOR_IA1',
  MICROINVASOR_IA2 = 'MICROINVASOR_IA2',
  CARCINOMA_ESCAMOSO_INVASOR = 'CARCINOMA_ESCAMOSO_INVASOR',
  ADENOCARCINOMA_INVASOR = 'ADENOCARCINOMA_INVASOR',
  OUTROS = 'OUTROS'
}

export const ResultadoProcedimentoLabel = {
  [ResultadoProcedimento.NIC_1]: 'NIC 1',
  [ResultadoProcedimento.NIC_2]: 'NIC 2',
  [ResultadoProcedimento.NIC_3]: 'NIC 3',
  [ResultadoProcedimento.ADENOCARCINOMA_IN_SITU]: 'Adenocarcinoma in situ',
  [ResultadoProcedimento.MICROINVASOR_IA1]: 'Microinvasor IA1',
  [ResultadoProcedimento.MICROINVASOR_IA2]: 'Microinvasor IA2',
  [ResultadoProcedimento.CARCINOMA_ESCAMOSO_INVASOR]:
    'Carcinoma escamoso invasor',
  [ResultadoProcedimento.ADENOCARCINOMA_INVASOR]:
    'Adenocarcinoma invasor',
  [ResultadoProcedimento.OUTROS]: 'Outros'
};