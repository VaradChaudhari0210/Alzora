import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({
  token: null,
  user: null,
  setToken: (token: string | null, user?: any) => {},
  loading: true,
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      setTokenState(storedToken);
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setLoading(false);
    })();
  }, []);

  const setToken = async (token: string | null, userObj?: any) => {
    setTokenState(token);
    if (token && userObj) {
        console.log("User OBJECT: ",userObj);
      setUser(userObj);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userObj));
    } else {
      setUser(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}