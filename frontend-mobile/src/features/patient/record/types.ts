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
    idDados: number;
    numGestacao: number;
    numPartoNormal: number;
    numCesariana: number;
    numAborto: number;
    menarca: number;
    menopausa: number | null;
  }[];
  saudeSexual: {
    idDados: number;
    sexarca: number;
    mac: string;
    numParceiros: number;
    vvs: boolean;
  }[];
  historicoTabagismo: {
    idHistorico: number;
    cigarrosDia: number | null;
    idadeInicio: number | null;
    idadeFim: number | null;
    fumante: string;
  }[];
  historicoIst: {
    idHistorico: number;
    ist: string;
    condilomaHpv: boolean | null;
  }[];
};

export type RecordTab =
  "personal" | "obstetric" | "sexual" | "ist" | "habits" | "visits";

// Abas sem registro no backend (ex.: paciente cadastrada só com dados pessoais).
export type MissingSections = {
  obstetric: boolean;
  sexual: boolean;
  ist: boolean;
  habits: boolean;
};

// Ids dos registros de histórico no backend, usados para editar (PUT)
// ou remover (DELETE). Sem id, a aba ainda não tem registro e é criada (POST).
export type RecordIds = {
  obstetric?: number;
  sexual?: number;
  habits?: number;
  ists: PatientDetail["historicoIst"];
};

export type PatientRecord = {
  id: number;
  ids: RecordIds;
  age: number;
  priorityGroup: boolean;
  form: PatientForm;
  missing: MissingSections;
};

// Abas de dados, que podem ser editadas (todas menos Atendimentos).
export type DataTab = Exclude<RecordTab, "visits">;

export type TabProps = {
  record: PatientRecord;
};
