// Keeps the logged-in user in one place so every page can use it
import { createContext, useContext, useEffect, useState } from 'react';
import api, { loginUser, signupUser, getMe } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check the saved token

  // On first load: if a token is saved, ask the server who we are
  useEffect(() => {
    const token = localStorage.getItem('orbit_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('orbit_token'))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = (data) => {
    localStorage.setItem('orbit_token', data.token);
    setUser(data.user);
  };

  const login = async (email, password) => saveSession(await loginUser({ email, password }));
  const signup = async (name, email, password) => saveSession(await signupUser({ name, email, password }));
  const logout = () => {
    localStorage.removeItem('orbit_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
