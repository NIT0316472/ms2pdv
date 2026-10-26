import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../services/api';
import { User } from '../types';

const AuthCtx = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('singularidade_token') || localStorage.getItem('ms2_token');
    if (savedToken) {
      api
        .get('/auth/me')
        .then(r => setUser(r.data.user))
        .catch(() => {
          localStorage.removeItem('singularidade_token');
          localStorage.removeItem('ms2_token');
        });
    }
  }, []);

  async function login(email: string, password: string) {
    const r = await api.post('/auth/login', { email, password });
    localStorage.setItem('singularidade_token', r.data.token);
    setUser(r.data.user);
  }

  function logout() {
    localStorage.removeItem('singularidade_token');
    localStorage.removeItem('ms2_token');
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
