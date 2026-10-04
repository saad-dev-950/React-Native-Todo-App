import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  clearSession,
  getSession,
  loginUser,
  registerUser,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const session = await getSession();

        if (session) {
          setToken(session.token);
          setUser(session.user);
        }
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function register(data) {
    const result = await registerUser(data);
    setToken(result.token);
    setUser(result.user);
  }

  async function login(data) {
    const result = await loginUser(data);
    setToken(result.token);
    setUser(result.user);
  }

  async function logout() {
    await clearSession();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
