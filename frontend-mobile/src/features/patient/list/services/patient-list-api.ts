import { getToken } from "@/features/auth/auth-session";
import { API_BASE_URL } from "@/features/auth/services/auth-api";

import { statusMap } from "../../registration/constants";
import type { PatientListItem } from "../types";

type PatientResponse = {
  idPaciente: number;
  nome: string;
  idade: number;
  prontuario: string;
  status: string;
  ultimaConsulta: string | null;
};

type PatientPage = {
  content: PatientResponse[];
  totalElements: number;
  totalPages: number;
};

const statusLabels = Object.fromEntries(
  Object.entries(statusMap).map(([label, value]) => [value, label]),
);

function formatLastVisit(value: string | null) {
  if (!value) return "sem consultas";

  const [date] = value.split("T");
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function toListItem(patient: PatientResponse): PatientListItem {
  return {
    id: patient.idPaciente,
    name: patient.nome,
    age: patient.idade,
    record: patient.prontuario,
    status: statusLabels[patient.status] ?? patient.status,
    lastVisit: formatLastVisit(patient.ultimaConsulta),
  };
}

export type PatientListResult = {
  patients: PatientListItem[];
  total: number;
};

export async function fetchPatients(
  search = "",
  status = "Todas",
): Promise<PatientListResult> {
  const token = getToken();

  if (!token) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const query = new URLSearchParams({
    size: "100",
    ...(search.trim() ? { busca: search.trim() } : {}),
    ...(status !== "Todas" && statusMap[status]
      ? { status: statusMap[status] }
      : {}),
  });

  async function fetchPage(pageNumber: number): Promise<PatientPage> {
    const response = await fetch(
      `${API_BASE_URL}/api/pacientes?page=${pageNumber}&${query}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (response.ok) return (await response.json()) as PatientPage;

    if (response.status === 401 || response.status === 403) {
      throw new Error("Sua sessão expirou. Faça login novamente.");
    }

    throw new Error("Não foi possível carregar as pacientes.");
  }

  const firstPage = await fetchPage(0);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(firstPage.totalPages - 1, 0) }, (_, index) =>
      fetchPage(index + 1),
    ),
  );

  const pages = [firstPage, ...remainingPages];
  const patients = pages.flatMap((page) => page.content);

  return {
    patients: patients.map(toListItem),
    total: firstPage.totalElements ?? patients.length,
  };
}
