import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiRequest, clearStoredTokens, getStoredTokens, setStoredTokens } from '../lib/api';
import type { AuthResponse, AuthSession } from '../lib/types';

interface SignInPayload {
  whatsappNumber: string;
  password: string;
}

interface SignUpPayload extends SignInPayload {
  name: string;
  storeName: string;
  email?: string;
}

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (payload: SignInPayload) => Promise<AuthSession>;
  signUp: (payload: SignUpPayload) => Promise<AuthSession>;
  signOut: () => void;
  reloadSession: () => Promise<AuthSession | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function extractSession(response: AuthResponse) {
  setStoredTokens({
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  });

  return response.session;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadSession = useCallback(async () => {
    const tokens = getStoredTokens();

    if (!tokens?.accessToken) {
      setSession(null);
      setLoading(false);
      return null;
    }

    try {
      const nextSession = await apiRequest<AuthSession>('/auth/me');
      setSession(nextSession);
      return nextSession;
    } catch (_error) {
      clearStoredTokens();
      setSession(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadSession();
  }, [reloadSession]);

  const signIn = useCallback(async (payload: SignInPayload) => {
    const response = await apiRequest<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true,
    });

    const nextSession = extractSession(response);
    setSession(nextSession);
    return nextSession;
  }, []);

  const signUp = useCallback(async (payload: SignUpPayload) => {
    const response = await apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true,
    });

    const nextSession = extractSession(response);
    setSession(nextSession);
    return nextSession;
  }, []);

  const signOut = useCallback(() => {
    clearStoredTokens();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loading,
      isAuthenticated: Boolean(session),
      signIn,
      signUp,
      signOut,
      reloadSession,
    }),
    [loading, reloadSession, session, signIn, signOut, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit etre utilise dans AuthProvider.');
  }

  return context;
}
