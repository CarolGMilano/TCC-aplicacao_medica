import { getToken } from "@/features/auth/auth-session";
import { API_BASE_URL } from "@/features/auth/services/auth-api";

import type { PatientDetail } from "../types";

export async function fetchPatient(id: string): Promise<PatientDetail> {
  const token = getToken();

  if (!token) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const response = await fetch(`${API_BASE_URL}/api/pacientes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) return (await response.json()) as PatientDetail;

  if (response.status === 401 || response.status === 403) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (response.status === 404) {
    throw new Error("Paciente não encontrada.");
  }

  throw new Error("Não foi possível carregar a ficha da paciente.");
}
