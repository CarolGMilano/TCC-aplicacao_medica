import { getToken } from "@/features/auth/auth-session";
import { apiFetch } from "@/features/auth/services/auth-api";

import {
  cytologyLabels,
  hpvTypeLabels,
  lesionLabels,
  procedureLabels,
  procedureResultLabels,
} from "../constants";
import type { Visit, VisitLists, VisitType } from "../types";

export const USE_MOCK_VISITS = false;

// Campos comuns às respostas de atendimento do backend.
type VisitResponse = {
  nomeMedico: string;
  observacao: string | null;
};

// Exames e procedimentos guardam também a data da última edição.
type Exam = VisitResponse & {
  dataRegistro: string;
  dataEdicao: string | null;
};

export type Consultation = VisitResponse & {
  idConsulta: number;
  dataHora: string;
};

export type Cytology = Exam & { idExame: number; resultado: string };

export type Pcr = Exam & {
  idExame: number;
  resultado: string;
  tiposHpv: string[] | null;
};

export type Colposcopy = Exam & {
  idColposcopia: number;
  estrogenizacao: boolean | null;
  jec: string | null;
  zt: string | null;
  lesao: boolean | null;
  grauLesao: string | null;
  classificacao: string | null;
  recidiva: boolean | null;
  verETratar: boolean | null;
  verETratarMotivo: string | null;
};

export type Procedure = Exam & {
  idProcedimento: number;
  tipo: string;
  qtFragmento: number | null;
  margemEndocervical: string | null;
  margemEctocervical: string | null;
  resultado: string;
};

export type VisitResponses = {
  consultations: Consultation;
  cytology: Cytology;
  pcr: Pcr;
  colposcopy: Colposcopy;
  procedures: Procedure;
};

const visitPaths: Record<VisitType, string> = {
  consultations: "/api/consultas",
  cytology: "/api/citologias",
  pcr: "/api/pcr",
  colposcopy: "/api/colposcopias",
  procedures: "/api/procedimentos",
};

// Cada tipo de registro tem o id com um nome diferente na resposta.
const visitIds: {
  [Type in VisitType]: (item: VisitResponses[Type]) => number;
} = {
  consultations: (item) => item.idConsulta,
  cytology: (item) => item.idExame,
  pcr: (item) => item.idExame,
  colposcopy: (item) => item.idColposcopia,
  procedures: (item) => item.idProcedimento,
};

async function get<T>(
  path: string,
  errorMessage = "Não foi possível carregar os atendimentos.",
): Promise<T> {
  const token = getToken();

  if (!token) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const response = await apiFetch(path, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) return (await response.json()) as T;

  if (response.status === 401 || response.status === 403) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  throw new Error(errorMessage);
}

// "2026-06-14" → "14/06/2026"; com hora, "14/06/2026 · 09:12".
export function formatDate(value: string) {
  const [date, time] = value.split("T");
  const [year, month, day] = date.split("-");
  const formatted = `${day}/${month}/${year}`;
  return time ? `${formatted} · ${time.slice(0, 5)}` : formatted;
}

function base(item: VisitResponse, date: string) {
  return {
    detail: item.observacao ?? "",
    date: formatDate(date),
    doctor: item.nomeMedico,
    tags: [] as string[],
    highlight: false,
  };
}

// Busca os cinco tipos de atendimento da paciente, já ordenados do mais
// recente para o mais antigo pelo backend.
export async function fetchVisits(id: number): Promise<VisitLists> {
  if (USE_MOCK_VISITS) {
    return {
      consultations: [],
      cytology: [],
      pcr: [],
      colposcopy: [],
      procedures: [],
    };
  }

  const [consultations, cytology, pcr, colposcopy, procedures] =
    await Promise.all([
      get<Consultation[]>(`${visitPaths.consultations}/paciente/${id}`),
      get<Cytology[]>(`${visitPaths.cytology}/paciente/${id}`),
      get<Pcr[]>(`${visitPaths.pcr}/paciente/${id}`),
      get<Colposcopy[]>(`${visitPaths.colposcopy}/paciente/${id}`),
      get<Procedure[]>(`${visitPaths.procedures}/paciente/${id}`),
    ]);

  return {
    consultations: consultations.map((item): Visit => ({
      ...base(item, item.dataHora),
      id: item.idConsulta,
      // Consulta não tem resultado: o texto da observação vira o título.
      title: item.observacao || "Consulta",
      detail: "",
    })),
    cytology: cytology.map((item): Visit => {
      const altered = item.resultado !== "NILM";
      return {
        ...base(item, item.dataRegistro),
        id: item.idExame,
        title: cytologyLabels[item.resultado] ?? item.resultado,
        tags: altered ? ["Alterado"] : [],
        highlight: altered,
      };
    }),
    pcr: pcr.map((item): Visit => {
      const positive = item.resultado === "POSITIVO";
      return {
        ...base(item, item.dataRegistro),
        id: item.idExame,
        title: positive
          ? (item.tiposHpv ?? [])
              .map((type) => hpvTypeLabels[type] ?? type)
              .join(" · ") || "Positivo"
          : "Negativo",
        tags: positive ? ["Positivo"] : [],
        highlight: positive,
      };
    }),
    colposcopy: colposcopy.map((item): Visit => {
      const tags = [
        ...(item.verETratar ? ["Ver e tratar"] : []),
        ...(item.recidiva ? ["Recidiva"] : []),
      ];
      return {
        ...base(item, item.dataRegistro),
        id: item.idColposcopia,
        title:
          item.lesao && item.grauLesao
            ? (lesionLabels[item.grauLesao] ?? item.grauLesao)
            : "Sem lesão",
        tags,
        highlight: tags.length > 0 || item.grauLesao === "INVASAO",
      };
    }),
    procedures: procedures.map((item): Visit => ({
      ...base(item, item.dataRegistro),
      id: item.idProcedimento,
      title: `${procedureLabels[item.tipo] ?? item.tipo} · ${
        procedureResultLabels[item.resultado] ?? item.resultado
      }`,
    })),
  };
}

// Um registro salvo, para ver e editar. O backend não busca registro por id:
// procura na lista da paciente, que já vem completa.
export async function fetchVisit<Type extends VisitType>(
  type: Type,
  patientId: number,
  recordId: number,
): Promise<VisitResponses[Type]> {
  const list = await get<VisitResponses[Type][]>(
    `${visitPaths[type]}/paciente/${patientId}`,
    "Não foi possível carregar o registro.",
  );
  const getId = visitIds[type];
  const item = list.find((visit) => getId(visit) === recordId);

  if (!item) throw new Error("Registro não encontrado.");
  return item;
}
