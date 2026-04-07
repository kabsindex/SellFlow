import type { AuthResponse, Tokens } from './types';

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:4000/api';
const TOKENS_KEY = 'sellflow.tokens';

let refreshPromise: Promise<Tokens | null> | null = null;

function getMessageFromPayload(payload: unknown) {
  if (typeof payload === 'string') {
    return payload;
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message;
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    Array.isArray(payload.message)
  ) {
    return payload.message.join(', ');
  }

  return 'Une erreur est survenue.';
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getStoredTokens(): Tokens | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(TOKENS_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as Tokens;
  } catch (_error) {
    window.localStorage.removeItem(TOKENS_KEY);
    return null;
  }
}

export function setStoredTokens(tokens: Tokens) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function clearStoredTokens() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(TOKENS_KEY);
}

async function parseResponse<T>(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? ((await response.json()) as T | { message?: string | string[] })
    : ((await response.text()) as T);

  if (!response.ok) {
    throw new Error(getMessageFromPayload(payload));
  }

  return payload as T;
}

async function refreshTokens() {
  if (refreshPromise) {
    return refreshPromise;
  }

  const currentTokens = getStoredTokens();

  if (!currentTokens?.refreshToken) {
    return null;
  }

  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken: currentTokens.refreshToken,
    }),
  })
    .then(async (response) => {
      const payload = await parseResponse<AuthResponse>(response);
      const nextTokens = {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      };

      setStoredTokens(nextTokens);
      return nextTokens;
    })
    .catch(() => {
      clearStoredTokens();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {},
): Promise<T> {
  const { skipAuth, headers, body, ...rest } = options;
  const tokens = getStoredTokens();
  const requestHeaders = new Headers(headers);

  if (!(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (!skipAuth && tokens?.accessToken) {
    requestHeaders.set('Authorization', `Bearer ${tokens.accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body,
  });

  if (response.status === 401 && !skipAuth) {
    const nextTokens = await refreshTokens();

    if (nextTokens?.accessToken) {
      requestHeaders.set('Authorization', `Bearer ${nextTokens.accessToken}`);
      const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: requestHeaders,
        body,
      });
      return parseResponse<T>(retryResponse);
    }
  }

  return parseResponse<T>(response);
}

export async function publicRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const requestHeaders = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: requestHeaders,
  });

  return parseResponse<T>(response);
}
