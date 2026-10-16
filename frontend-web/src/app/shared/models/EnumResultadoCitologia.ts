export enum ResultadoCitologia {
  NILM = 'NILM',
  ASC_US = 'ASC_US',
  LSIL = 'LSIL',
  ASC_H = 'ASC_H',
  HSIL = 'HSIL',
  HSIL_COM_CARACTERISTICAS_SUGESTIVAS_DE_INVASAO = 'HSIL_COM_CARACTERISTICAS_SUGESTIVAS_DE_INVASAO',
  CARCINOMA_DE_CELULAS_ESCAMOSAS = 'CARCINOMA_DE_CELULAS_ESCAMOSAS',
  AGC_SOE = 'AGC_SOE',
  AGC_ENDOCERVICAL = 'AGC_ENDOCERVICAL',
  AGC_ENDOMETRIAL = 'AGC_ENDOMETRIAL',
  AGC_FAVORECENDO_NEOPLASIA = 'AGC_FAVORECENDO_NEOPLASIA',
  AIS_ENDOCERVICAL = 'AIS_ENDOCERVICAL',
  ADENOCARCINOMA_ENDOCERVICAL = 'ADENOCARCINOMA_ENDOCERVICAL',
  ADENOCARCINOMA_ENDOMETRIAL = 'ADENOCARCINOMA_ENDOMETRIAL',
  ADENOCARCINOMA_EXTRAUTERINO = 'ADENOCARCINOMA_EXTRAUTERINO',
  ADENOCARCINOMA_SOE = 'ADENOCARCINOMA_SOE'
}

export const ResultadoCitologiaLabel = {
  [ResultadoCitologia.NILM]: 'NILM',
  [ResultadoCitologia.ASC_US]: 'ASC-US',
  [ResultadoCitologia.LSIL]: 'LSIL',
  [ResultadoCitologia.ASC_H]: 'ASC-H',
  [ResultadoCitologia.HSIL]: 'HSIL',
  [ResultadoCitologia.HSIL_COM_CARACTERISTICAS_SUGESTIVAS_DE_INVASAO]:
    'HSIL com características sugestivas de invasão',
  [ResultadoCitologia.CARCINOMA_DE_CELULAS_ESCAMOSAS]:
    'Carcinoma de células escamosas',
  [ResultadoCitologia.AGC_SOE]: 'AGC-SOE',
  [ResultadoCitologia.AGC_ENDOCERVICAL]: 'AGC endocervical',
  [ResultadoCitologia.AGC_ENDOMETRIAL]: 'AGC endometrial',
  [ResultadoCitologia.AGC_FAVORECENDO_NEOPLASIA]:
    'AGC favorecendo neoplasia',
  [ResultadoCitologia.AIS_ENDOCERVICAL]: 'AIS endocervical',
  [ResultadoCitologia.ADENOCARCINOMA_ENDOCERVICAL]:
    'Adenocarcinoma endocervical',
  [ResultadoCitologia.ADENOCARCINOMA_ENDOMETRIAL]:
    'Adenocarcinoma endometrial',
  [ResultadoCitologia.ADENOCARCINOMA_EXTRAUTERINO]:
    'Adenocarcinoma extrauterino',
  [ResultadoCitologia.ADENOCARCINOMA_SOE]:
    'Adenocarcinoma SOE'
};