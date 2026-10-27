import { getToken } from "@/features/auth/auth-session";
import { apiFetch } from "@/features/auth/services/auth-api";

// Respostas de /api/dashboard (indicadores do dashboard mobile).
export type AttendedResponse = { hoje: number; semana: number; mes: number };

export type StatusCountsResponse = {
  total: number;
  situacoes: { status: string; total: number }[];
};

export type ExamIndicatorsResponse = {
  mes: string;
  examesNoMes: number;
  examesMesAnterior: number;
  variacaoPercentual: number | null;
  citologiaPorResultado: { resultado: string; total: number }[];
  pcrPorResultado: { negativo: number; hpv16ou18: number; outros: number };
  verETratarRealizados: number;
};

export type NoRecentExamResponse = {
  idPaciente: number;
  nome: string;
  prontuario: string;
  ultimoExame: string | null;
}[];

async function getJson<T>(path: string, error: string): Promise<T> {
  const response = await apiFetch(path, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) throw new Error(error);
  return (await response.json()) as T;
}

export const fetchTotalPatients = async () =>
  (
    await getJson<{ totalPacientes: number }>(
      "/api/dashboard/kpis",
      "Não foi possível carregar o total de pacientes.",
    )
  ).totalPacientes;

export const fetchAttended = () =>
  getJson<AttendedResponse>(
    "/api/dashboard/pacientes-atendidas",
    "Não foi possível carregar as pacientes atendidas.",
  );

export const fetchStatusCounts = () =>
  getJson<StatusCountsResponse>(
    "/api/dashboard/pacientes-por-situacao",
    "Não foi possível carregar as pacientes por situação.",
  );

export const fetchExamIndicators = () =>
  getJson<ExamIndicatorsResponse>(
    "/api/dashboard/exames",
    "Não foi possível carregar os indicadores de exames.",
  );

export const fetchNoRecentExam = (years: number) =>
  getJson<NoRecentExamResponse>(
    `/api/dashboard/pacientes/sem-exame?anos=${years}`,
    "Não foi possível carregar as pacientes sem exame.",
  );
