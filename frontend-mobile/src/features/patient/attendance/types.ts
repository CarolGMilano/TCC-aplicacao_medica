import type { DateParts } from "./utils";

export type AttendancePatient = {
  id: number;
  name: string;
  record: string;
};

export type ConsultationForm = {
  date: DateParts;
  time: string;
  observation: string;
};

export type CytologyForm = {
  day: string;
  month: string;
  year: string;
  result: string;
  observation: string;
};

export type ConsultationRequest = {
  idPaciente: number;
  dataHora: string;
  observacao: string;
};

export type PcrRequest = {
  idPaciente: number;
  dataRegistro: string;
  resultado: string;
  tiposHpv: string[];
  observacao: string;
};

export type ColposcopyRequest = {
  idPaciente: number;
  dataRegistro: string;
  estrogenizacao: boolean;
  jec: string;
  zt: string;
  lesao: boolean;
  recidiva: boolean;
  grauLesao: string | null;
  classificacao: string | null;
  observacao: string;
  verETratar: boolean;
  verETratarMotivo: string;
};

export type ProcedureRequest = {
  idPaciente: number;
  dataRegistro: string;
  tipo: string;
  qtFragmento: number;
  margemEndocervical: string | null;
  margemEctocervical: string | null;
  resultado: string;
  observacao: string;
};

export type CytologyRequest = {
  idPaciente: number;
  dataRegistro: string;
  resultado: string;
  observacao: string;
};
