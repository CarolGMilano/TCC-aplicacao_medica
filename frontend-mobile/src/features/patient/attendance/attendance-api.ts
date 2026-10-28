import { getToken } from "@/features/auth/auth-session";
import { apiFetch } from "@/features/auth/services/auth-api";

// Nome do médico logado, mostrado como responsável pelo novo registro.
export async function fetchDoctorName() {
  const token = getToken();
  if (!token) return null;

  const response = await apiFetch("/api/perfil", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;

  const profile = (await response.json()) as { nome?: string };
  return profile.nome ?? null;
}

// Envio comum dos registros de atendimento: POST cria o registro; com id,
// PUT em path/id altera o registro salvo.
export async function saveAttendance<Request>(
  path: string,
  request: Request,
  errorMessage: string,
  id?: number,
) {
  const token = getToken();
  if (!token) throw new Error("Sua sessão expirou. Faça login novamente.");

  const response = await apiFetch(id === undefined ? path : `${path}/${id}`, {
    method: id === undefined ? "POST" : "PUT",
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
  throw new Error((await readRuleMessage(response)) ?? errorMessage);
}

// Regra recusada pelo backend (400): a mensagem dele explica o que corrigir,
// ex.: "A data do registro não pode ser anterior ao nascimento da paciente.".
export async function readRuleMessage(response: Response) {
  if (response.status !== 400) return null;
  try {
    const body = (await response.json()) as {
      message?: string;
      messages?: Record<string, string>;
    };
    return body.message ?? Object.values(body.messages ?? {})[0] ?? null;
  } catch {
    return null;
  }
}
