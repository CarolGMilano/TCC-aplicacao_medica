let accessToken: string | null = null;

export function saveToken(token: string) {
  accessToken = token;
}

export function getToken() {
  return accessToken;
}

export function logout() {
  accessToken = null;
}