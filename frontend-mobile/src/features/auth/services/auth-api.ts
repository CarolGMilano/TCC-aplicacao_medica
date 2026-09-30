import { Platform } from 'react-native';
import { saveToken } from '../auth-session';


const localHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

/**
 * Configure EXPO_PUBLIC_API_URL when the backend is running on another host.
 * Android emulators use 10.0.2.2 to reach the host machine's localhost.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${localHost}:8080`;

export type LoginResponse = {
  token: string;
  tipo: string;
};

export async function login(
  email: string,
  senha: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });

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