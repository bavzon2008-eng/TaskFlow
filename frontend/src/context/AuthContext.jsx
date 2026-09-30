import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../services/api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  const logout = useCallback(() => { setToken(null); setUser(null); }, []);

  useEffect(() => {
    if (!getToken()) return;
    api.me().then((d) => setUser(d.user)).catch(() => setToken(null)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    window.addEventListener('taskflow:unauthorized', logout);
    return () => window.removeEventListener('taskflow:unauthorized', logout);
  }, [logout]);

  const authenticate = async (call, body) => {
    const d = await call(body);
    setToken(d.token);
    setUser(d.user);
  };
  const login = (b) => authenticate(api.login, b);
  const signup = (b) => authenticate(api.signup, b);

  return <Ctx.Provider value={{ user, loading, login, signup, logout }}>{children}</Ctx.Provider>;
}
