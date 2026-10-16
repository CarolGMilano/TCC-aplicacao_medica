import { getToken } from "@/features/auth/auth-session";
import { API_BASE_URL } from "@/features/auth/services/auth-api";

import { saveMockCytology } from "../mocks";
import type { CytologyRequest } from "../types";

export const USE_MOCK_CYTOLOGY = false;

export async function createCytology(request: CytologyRequest) {
  if (USE_MOCK_CYTOLOGY) return saveMockCytology(request);

  const token = getToken();
  if (!token) throw new Error("Sua sessão expirou. Faça login novamente.");

  const response = await fetch(`${API_BASE_URL}/api/citologias`, {
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
  throw new Error("Não foi possível salvar a citologia.");
}
