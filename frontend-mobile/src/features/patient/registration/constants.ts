import { PatientForm } from "./types";


export const totalSteps = 6;

export const stepTitles = [
  "Dados pessoais",
  "Gineco-obstétricos",
  "Dados sexuais",
  "Histórico de IST",
  "Hábitos",
  "Conferir e cadastrar",
];

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
  sexarche: 17,
  multiplePartners: false,
  contraception: "Anticoncepcional oral combinado",
  partners: 0,
  ist: "HPV",
  hpvWart: true,
  smoking: "Nunca",
  smokingStart: 18,
  smokingEnd: 39,
  cigarettesPerDay: 12,
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
  Nenhum: "NENHUM",
};

export const smokingMap: Record<string, string> = {
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
