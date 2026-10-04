import { Theme } from "@/constants/theme";

import type { DataTab, RecordTab } from "./types";

// Abas da ficha, na ordem e com os rótulos curtos do layout.
export const recordTabs: { id: RecordTab; label: string }[] = [
  { id: "personal", label: "Pessoais" },
  { id: "obstetric", label: "Gineco" },
  { id: "sexual", label: "Sexual" },
  { id: "ist", label: "IST" },
  { id: "habits", label: "Tabag." },
  { id: "visits", label: "Atend." },
];

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
