import { Platform } from "react-native";

import { saveToken } from "../auth-session";

const localHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";

/**
 * Configure EXPO_PUBLIC_API_URL when the backend is running on another host.
 * Android emulators use 10.0.2.2 to reach the host machine's localhost.
 * O Spring Boot roda na 8081 (backend/src/main/resources/application.yaml);
 * por isso o Metro (Expo) sobe na 8082 pelos scripts do package.json.
 */
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${localHost}:8081`;

const REQUEST_TIMEOUT = 15000;

// Chamada comum à API. Sem resposta do servidor (sem rede, backend fora ou IP
// que não responde), o fetch rejeita com um texto técnico em inglês e, no
// Android, pode esperar uns 2 minutos. Os erros HTTP ficam com cada service.
export async function apiFetch(path: string, init: RequestInit = {}) {
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), REQUEST_TIMEOUT);
  const signal = init.signal
    ? AbortSignal.any([init.signal, timeout.signal])
    : timeout.signal;

  try {
    return await fetch(`${API_BASE_URL}${path}`, { ...init, signal });
  } catch (error) {
    // Cancelada por quem chamou: não é falha de conexão.
    if (init.signal?.aborted) throw error;
    // Um envio que passou do limite pode ter chegado ao servidor e sido
    // gravado (o login não grava nada).
    if (
      timeout.signal.aborted &&
      (init.method ?? "GET") !== "GET" &&
      path !== "/api/auth/login"
    ) {
      throw new Error(
        "O servidor demorou para responder. Confira se os dados foram salvos antes de tentar de novo.",
      );
    }
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.",
    );
  } finally {
    clearTimeout(timer);
  }
}

// Login mock só para desenvolvimento sem backend; o backend exige JWT real.
const USE_MOCK_LOGIN = false;

export type LoginResponse = {
  token: string;
  tipo: string;
};

export async function login(
  email: string,
  senha: string,
): Promise<LoginResponse> {
  if (USE_MOCK_LOGIN) {
    const mockResponse: LoginResponse = {
      token: 'token-desenvolvimento',
      tipo: 'MEDICO',
    };
    // Sem isso o cadastro de paciente sempre acusa "sessão expirada".
    saveToken(mockResponse.token);
    return mockResponse;
  }

  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });

  // 400 vem da validação do LoginRequestDTO (@Email): e-mail fora do formato.
  if (response.status === 400) {
    throw new Error('Confira o e-mail digitado.');
  }

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? 'E-mail ou senha inválidos.'
        : 'Não foi possível entrar agora.',
    );
  }

  const result = (await response.json()) as LoginResponse;

  saveToken(result.token);

  return result;
}
