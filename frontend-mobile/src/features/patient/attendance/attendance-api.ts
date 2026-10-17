import { getToken } from "@/features/auth/auth-session";
import { API_BASE_URL } from "@/features/auth/services/auth-api";

// Nome do médico logado, mostrado como responsável pelo novo registro.
export async function fetchDoctorName() {
  const token = getToken();
  if (!token) return null;

  const response = await fetch(`${API_BASE_URL}/api/perfil`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;

  const profile = (await response.json()) as { nome?: string };
  return profile.nome ?? null;
}

// POST comum dos registros de atendimento (PCR, colposcopia, procedimento).
export async function postAttendance<Request>(
  path: string,
  request: Request,
  errorMessage: string,
) {
  const token = getToken();
  if (!token) throw new Error("Sua sessão expirou. Faça login novamente.");

  const response = await fetch(`${API_BASE_URL}${path}`, {
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
  throw new Error(errorMessage);
}
