export type AttendancePatient = {
  id: number;
  name: string;
  record: string;
};

export type ConsultationForm = {
  date: string;
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

export type CytologyRequest = {
  idPaciente: number;
  dataRegistro: string;
  resultado: string;
  observacao: string;
};
