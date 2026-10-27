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

// Pacientes com consulta ou exame registrado no período.
export const attended = { day: 9, week: 41, month: 168 };

export const indicators = {
  period: "Outubro 2026 · comparado a setembro",
  exams: { value: 86, change: "↑ 12% em relação a setembro" },
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
  seeAndTreat: { done: 9 },
};
