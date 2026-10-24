import { Theme } from "@/constants/theme";

import type { DataTab, RecordTab, VisitType } from "./types";

// Abas da ficha, na ordem da especificação: os blocos do cadastro e, por
// último, os dados clínicos (atendimentos).
export const recordTabs: { id: RecordTab; label: string }[] = [
  { id: "personal", label: "Dados pessoais" },
  { id: "obstetric", label: "Dados gineco-obstétricos" },
  { id: "sexual", label: "Saúde sexual" },
  { id: "ist", label: "Histórico de IST" },
  { id: "habits", label: "Histórico tabagista" },
  { id: "clinical", label: "Dados clínicos" },
];

// Blocos do histórico clínico, na ordem do cadastro.
export const sectionLabels: Record<DataTab, string> = {
  personal: "Identificação",
  obstetric: "Gineco-obstétrico",
  sexual: "Vida sexual",
  ist: "IST",
  habits: "Tabagismo",
};

// Etapa do cadastro equivalente a cada aba, para reaproveitar a validação.
export const tabSteps: Record<DataTab, number> = {
  personal: 1,
  obstetric: 2,
  sexual: 3,
  ist: 4,
  habits: 5,
};

// Cores do selo de status, com o texto da tela como chave.
export const statusColors: Record<
  string,
  { text: string; background: string }
> = {
  "Em investigação": {
    text: Theme.investigationDark,
    background: Theme.investigationLight,
  },
  "Em tratamento": {
    text: Theme.treatmentDark,
    background: Theme.treatmentLight,
  },
  "Aguardando procedimento": {
    text: Theme.waitingDark,
    background: Theme.waitingLight,
  },
  "Pós-procedimento": {
    text: Theme.postProcedureDark,
    background: Theme.postProcedureLight,
  },
  "Acompanhamento preventivo": {
    text: Theme.followUpDark,
    background: Theme.followUpLight,
  },
  Alta: { text: Theme.dischargeDark, background: Theme.dischargeLight },
};

export const priorityColors = {
  inside: {
    text: Theme.administratorDark,
    background: Theme.administratorLight,
  },
  outside: { text: Theme.textSecondary, background: Theme.backgroundSelected },
};

// Filtros da aba Atend., na ordem do layout.
export const visitFilters: { id: VisitType; label: string }[] = [
  { id: "consultations", label: "Consultas" },
  { id: "cytology", label: "Citologia" },
  { id: "pcr", label: "PCR DNA HPV" },
  { id: "colposcopy", label: "Colposcopia" },
  { id: "procedures", label: "Procedimento" },
];

// Textos dos enums de atendimento do backend.
export const cytologyLabels: Record<string, string> = {
  NILM: "NILM",
  ASC_US: "ASC-US",
  LSIL: "LSIL",
  ASC_H: "ASC-H",
  HSIL: "HSIL",
  HSIL_COM_CARACTERISTICAS_SUGESTIVAS_DE_INVASAO:
    "HSIL com características sugestivas de invasão",
  CARCINOMA_DE_CELULAS_ESCAMOSAS: "Carcinoma de células escamosas",
  AGC_SOE: "AGC SOE",
  AGC_ENDOCERVICAL: "AGC endocervical",
  AGC_ENDOMETRIAL: "AGC endometrial",
  AGC_FAVORECENDO_NEOPLASIA: "AGC favorecendo neoplasia",
  AIS_ENDOCERVICAL: "AIS endocervical",
  ADENOCARCINOMA_ENDOCERVICAL: "Adenocarcinoma endocervical",
  ADENOCARCINOMA_ENDOMETRIAL: "Adenocarcinoma endometrial",
  ADENOCARCINOMA_EXTRAUTERINO: "Adenocarcinoma extrauterino",
  ADENOCARCINOMA_SOE: "Adenocarcinoma SOE",
};

export const lesionLabels: Record<string, string> = {
  ACHADO_MAIOR: "Achado maior",
  ACHADO_MENOR: "Achado menor",
  INVASAO: "Invasão",
};

export const pcrResultLabels: Record<string, string> = {
  POSITIVO: "Positivo",
  NEGATIVO: "Negativo",
};

export const hpvTypeLabels: Record<string, string> = {
  HPV_6: "HPV 6",
  HPV_11: "HPV 11",
  HPV_16: "HPV 16",
  HPV_18: "HPV 18",
  OUTROS: "Outros",
};

// Junção escamocolunar: o backend recebe o próprio texto ("-4" a "0").
export const jecOptions = ["-4", "-3", "-2", "-1", "0"];

// Como no layout, os botões mostram só o número da zona.
export const transformationZoneLabels: Record<string, string> = {
  ZT_1: "1",
  ZT_2: "2",
  ZT_3: "3",
};

// Classificação da lesão (pequena, média, grande): o backend usa P, M e G.
export const lesionSizeOptions = ["P", "M", "G"];

export const marginLabels: Record<string, string> = {
  LIVRE: "Livre",
  COMPROMETIDA: "Comprometida",
  COINCIDENTE: "Coincidente",
};

export const procedureLabels: Record<string, string> = {
  BIOPSIA: "Biópsia",
  EZT_1: "EZT 1",
  EZT_2: "EZT 2",
  EZT_3: "EZT 3",
};

export const procedureResultLabels: Record<string, string> = {
  NIC_1: "NIC 1",
  NIC_2: "NIC 2",
  NIC_3: "NIC 3",
  ADENOCARCINOMA_IN_SITU: "Adenocarcinoma in situ",
  MICROINVASOR_IA1: "Microinvasor IA1",
  MICROINVASOR_IA2: "Microinvasor IA2",
  CARCINOMA_ESCAMOSO_INVASOR: "Carcinoma escamoso invasor",
  ADENOCARCINOMA_INVASOR: "Adenocarcinoma invasor",
  OUTROS: "Outros",
};
