import { getToken } from "@/features/auth/auth-session";
import { apiFetch } from "@/features/auth/services/auth-api";

import { readRuleMessage } from "../attendance-api";
import { saveMockConsultation } from "../mocks";
import type { ConsultationRequest } from "../types";

export const USE_MOCK_CONSULTATION = false;

export async function createConsultation(request: ConsultationRequest) {
  if (USE_MOCK_CONSULTATION) return saveMockConsultation(request);

  const token = getToken();
  if (!token) throw new Error("Sua sessão expirou. Faça login novamente.");

  const response = await apiFetch("/api/consultas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (response.ok) return response.json();
  if (response.status === 401 || response.status === 403) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }
  throw new Error(
    (await readRuleMessage(response)) ?? "Não foi possível salvar a consulta.",
  );
}
