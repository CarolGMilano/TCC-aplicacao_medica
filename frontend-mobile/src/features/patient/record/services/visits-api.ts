import { getToken } from "@/features/auth/auth-session";
import { API_BASE_URL } from "@/features/auth/services/auth-api";

import {
  cytologyLabels,
  lesionLabels,
  procedureLabels,
  procedureResultLabels,
} from "../constants";
import type { Visit, VisitLists } from "../types";

// Campos comuns às respostas de atendimento do backend.
type VisitResponse = {
  nomeMedico: string;
  observacao: string | null;
};

type Consultation = VisitResponse & { idConsulta: number; dataHora: string };

type Exam = VisitResponse & { dataRegistro: string };

type Cytology = Exam & { idExame: number; resultado: string };

type Pcr = Exam & { idExame: number; resultado: string; tiposHpv: string[] };

type Colposcopy = Exam & {
  idColposcopia: number;
  lesao: boolean;
  grauLesao: string | null;
  recidiva: boolean | null;
  verETratar: boolean;
};

type Procedure = Exam & {
  idProcedimento: number;
  tipo: string;
  resultado: string;
};

async function get<T>(path: string): Promise<T> {
  const token = getToken();

  if (!token) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) return (await response.json()) as T;

  if (response.status === 401 || response.status === 403) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  throw new Error("Não foi possível carregar os atendimentos.");
}

// "2026-06-14" → "14/06/2026"; com hora, "14/06/2026 · 09:12".
function formatDate(value: string) {
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
  const [consultations, cytology, pcr, colposcopy, procedures] =
    await Promise.all([
      get<Consultation[]>(`/api/consultas/paciente/${id}`),
      get<Cytology[]>(`/api/citologias/paciente/${id}`),
      get<Pcr[]>(`/api/pcr/paciente/${id}`),
      get<Colposcopy[]>(`/api/colposcopias/paciente/${id}`),
      get<Procedure[]>(`/api/procedimentos/paciente/${id}`),
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
          ? item.tiposHpv.map((type) => type.replace("_", " ")).join(" · ") ||
            "Positivo"
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
