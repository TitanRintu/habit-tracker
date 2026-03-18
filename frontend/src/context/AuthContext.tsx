import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseEmail(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ht_token'));
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    const t = localStorage.getItem('ht_token');
    return t ? parseEmail(t) : null;
  });

  const signIn = (t: string) => {
    localStorage.setItem('ht_token', t);
    setToken(t);
    setUserEmail(parseEmail(t));
  };

  const signOut = () => {
    localStorage.removeItem('ht_token');
    setToken(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, userEmail, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
