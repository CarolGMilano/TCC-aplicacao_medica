import type { PatientForm, SmokingStatus } from "./types";

export const stepTitles = [
  "Dados pessoais",
  "Gineco-obstétricos",
  "Dados sexuais",
  "Histórico de IST",
  "Hábitos",
  "Conferir e cadastrar",
];

export const totalSteps = stepTitles.length;

// Idades mínimas dos contadores, conforme o layout.
export const minAges = {
  menarche: 8,
  menopause: 30,
  sexarche: 8,
  smoking: 5,
};

// Valores neutros: nada clínico vem pré-marcado.
export const initialForm: PatientForm = {
  name: "",
  birthDay: "",
  birthMonth: "",
  birthYear: "",
  record: "",
  status: "Aguardando procedimento",
  pregnancies: 0,
  vaginalBirths: 0,
  cesareans: 0,
  abortions: 0,
  menarche: 12,
  menopause: false,
  menopauseAge: 45,
  sexarche: 17,
  vvs: false,
  contraception: "Nenhum",
  partners: 0,
  ists: [],
  hpvWart: false,
  smoking: "Nunca",
  smokingStart: 18,
  smokingEnd: 18,
  cigarettesPerDay: 0,
};

export const statusMap: Record<string, string> = {
  "Em investigação": "EM_INVESTIGACAO",
  "Em tratamento": "EM_TRATAMENTO",
  "Aguardando procedimento": "AGUARDANDO_PROCEDIMENTO",
  "Pós-procedimento": "POS_PROCEDIMENTO",
  "Acompanhamento preventivo": "ACOMPANHAMENTO_PREVENTIVO",
  Alta: "ALTA",
};

export const contraceptionMap: Record<string, string> = {
  Nenhum: "NENHUM",
  "Anticoncepcional oral combinado": "ANTICONCEPCIONAL_ORAL_COMBINADO",
  "Anticoncepcional oral progestagênio isolado":
    "ANTICONCEPCIONAL_ORAL_PROGESTAGENIO_ISOLADO",
  "Implante de etonogestrel": "IMPLANTE_ETONOGESTREL",
  "DIU hormonal": "DIU_HORMONAL",
  "DIU não hormonal": "DIU_NAO_HORMONAL",
  "Laqueadura tubária": "LAQUEADURA_TUBARIA",
  "Anel vaginal": "ANEL_VAGINAL",
  "Adesivo transdérmico": "ADESIVO_TRANSDERMICO",
  Preservativo: "PRESERVATIVO",
};

export const smokingMap: Record<SmokingStatus, string> = {
  Fuma: "FUMANTE",
  Parou: "EX_FUMANTE",
  Nunca: "NAO_FUMANTE",
};

export const istMap: Record<string, string> = {
  HPV: "HPV",
  HIV: "HIV",
  "Herpes genital": "HERPES_GENITAL",
  Tricomoníase: "TRICOMONIASE",
  Gonorreia: "GONORREIA",
  Clamídia: "CLAMIDIA",
  Sífilis: "SIFILIS",
  "Não sabe": "NAO_SABE",
  Nenhuma: "NENHUMA",
};

// As opções da tela saem dos mapas: uma única fonte para tela e backend.
export const statusOptions = Object.keys(statusMap);
export const contraceptionOptions = Object.keys(contraceptionMap);
export const istOptions = Object.keys(istMap);
export const smokingOptions = Object.keys(smokingMap) as SmokingStatus[];
export const exclusiveIsts = ["Não sabe", "Nenhuma"];
