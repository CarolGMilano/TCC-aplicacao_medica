import { Theme } from "@/constants/theme";

// Números ainda fixos do dashboard, até o backend ter os endpoints.

export const TOTAL_PATIENTS = 248;

export const doctor = {
  date: "Qui, 23 out",
  name: "Dra. Ana Ribeiro",
  crm: "CRM 118 402",
};

// Somam TOTAL_PATIENTS.
export const statusCounts = [
  { status: "Em investigação", count: 42 },
  { status: "Aguardando procedimento", count: 18 },
  { status: "Em tratamento", count: 27 },
  { status: "Pós-procedimento", count: 35 },
  { status: "Acompanhamento preventivo", count: 98 },
  { status: "Alta", count: 28 },
];

export const todayRecords = {
  count: 6,
  recent: ["Maria S. Costa", "Joana P. Lima", "Rita A. Souza", "Lúcia M. Reis"],
};

export const changedWithoutNextStep = [
  { name: "Clara M. Duarte", detail: "Citologia ASC-US · 2 meses", days: "64 dias" },
  { name: "Sônia R. Prado", detail: "PCR HPV 16/18 · 1 mês", days: "38 dias" },
];

export const lateScreening = [
  { name: "Helena B. Nunes", detail: "Último exame em 03/2022", days: "4 anos" },
  { name: "Vera L. Matos", detail: "Último exame em 08/2023", days: "3 anos" },
];

export const priorityGroup = [
  { label: "Imunossuprimidas", value: 14 },
  { label: "Gestantes", value: 6 },
  { label: "Menores de 25 anos", value: 11 },
];

export const riskFactors = [
  { label: "Fumantes", value: 37 },
  { label: "HPV 16/18", value: 22 },
  { label: "Outras ISTs", value: 19 },
];

export const monthMovement = [
  { label: "Mudaram de situação", value: 31 },
  { label: "Receberam alta", value: 7 },
];

export const indicators = {
  period: "Outubro 2026 · comparado a setembro",
  exams: { value: 86, change: "↑ 12%" },
  changedPercent: "18%",
  cytology: [
    { label: "Normal", count: 61, color: Theme.primary },
    { label: "ASC-US", count: 12, color: Theme.tertiary },
    { label: "LSIL", count: 8, color: Theme.warning },
    { label: "HSIL", count: 5, color: Theme.error },
  ],
  pcr: [
    { label: "Negativo", count: 24, color: Theme.primary },
    { label: "HPV 16/18", count: 7, color: Theme.error },
    { label: "Outros", count: 9, color: Theme.warning },
  ],
  colposcopyDays: 34,
  seeAndTreat: { done: 9, compromisedMargin: "11%" },
};
