import type { PatientForm } from "../registration/types";

// Resposta de GET /api/pacientes/{id} (PacienteDetalhadoResponseDTO).
// Cada histórico vem como lista, do registro mais recente para o mais antigo.
export type PatientDetail = {
  idPaciente: number;
  nome: string;
  dataNascimento: string;
  idade: number;
  prontuario: string;
  status: string;
  grupoPrioritario: boolean;
  dadosGinecoObstetricos: {
    numGestacao: number;
    numPartoNormal: number;
    numCesariana: number;
    numAborto: number;
    menarca: number;
    menopausa: number | null;
  }[];
  saudeSexual: {
    sexarca: number;
    mac: string;
    numParceiros: number;
    vvs: boolean;
  }[];
  historicoTabagismo: {
    cigarrosDia: number | null;
    idadeInicio: number | null;
    idadeFim: number | null;
    fumante: string;
  }[];
  historicoIst: {
    ist: string;
    condilomaHpv: boolean | null;
  }[];
};

export type RecordTab =
  | "personal"
  | "obstetric"
  | "sexual"
  | "ist"
  | "habits"
  | "visits";

// Abas sem registro no backend (ex.: paciente cadastrada só com dados pessoais).
export type MissingSections = {
  obstetric: boolean;
  sexual: boolean;
  ist: boolean;
  habits: boolean;
};

export type PatientRecord = {
  id: number;
  age: number;
  priorityGroup: boolean;
  form: PatientForm;
  missing: MissingSections;
};

export type TabProps = {
  record: PatientRecord;
};
