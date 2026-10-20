import { getToken } from "@/features/auth/auth-session";
import { apiFetch } from "@/features/auth/services/auth-api";

import { mockPatients } from "../../list/mocks/patients";
import { statusMap } from "../../registration/constants";
import type { PatientDetail } from "../types";

export const USE_MOCK_PATIENT_RECORD = false;
const mockStatuses: Record<number, string> = {};

const mockBirthDates: Record<number, string> = {
  1: "1984-08-02",
  2: "1989-09-02",
  3: "1975-07-21",
  4: "1997-08-28",
  5: "1981-08-30",
  6: "1988-09-01",
  7: "1969-06-18",
};

function getMockPatient(id: string): PatientDetail {
  const patient = mockPatients.find((item) => String(item.id) === id);

  if (!patient) {
    throw new Error("Paciente não encontrada.");
  }

  return {
    idPaciente: patient.id,
    nome: patient.name,
    dataNascimento: mockBirthDates[patient.id] ?? "1990-01-01",
    idade: patient.age,
    prontuario: patient.record,
    status: mockStatuses[patient.id] ?? statusMap[patient.status] ?? patient.status,
    grupoPrioritario: patient.id % 2 === 0,
    dadosGinecoObstetricos: [],
    saudeSexual: [],
    historicoTabagismo: [],
    historicoIst: [],
  };
}

export function updateMockPatientStatus(id: number, status: string) {
  const backendStatus = statusMap[status] ?? status;
  mockStatuses[id] = backendStatus;
  const patient = mockPatients.find((item) => item.id === id);
  if (patient) patient.status = status;
}

export async function updatePatientStatus(id: number, status: string) {
  if (USE_MOCK_PATIENT_RECORD) {
    updateMockPatientStatus(id, status);
    return;
  }

  const token = getToken();
  if (!token) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const response = await apiFetch(
    `/api/pacientes/${id}/status?status=${encodeURIComponent(statusMap[status] ?? status)}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (response.ok) return;
  if (response.status === 401 || response.status === 403) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }
  throw new Error("Não foi possível alterar o status da paciente.");
}

export async function fetchPatient(id: string): Promise<PatientDetail> {
  if (USE_MOCK_PATIENT_RECORD) {
    return getMockPatient(id);
  }

  const token = getToken();

  if (!token) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const response = await apiFetch(`/api/pacientes/${id}`, {
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
