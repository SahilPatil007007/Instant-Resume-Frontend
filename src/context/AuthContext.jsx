import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { handleApiError, showToast } from "../utils/toast.js";

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Check current user when app loads
  useEffect(() => {
    axios
      .get(`${API_URL}/api/me`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Signup
  const signup = async (name, email, password) => {
    try {
      const loadingToast = showToast.loading('Creating your account...');
      
      const res = await axios.post(
        `${API_URL}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      
      showToast.dismiss(loadingToast);
      showToast.success('Account created successfully! Welcome!');
      setUser(res.data); // set user from backend response
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const loadingToast = showToast.loading('Signing you in...');
      
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      
      showToast.dismiss(loadingToast);
      showToast.success('Welcome back!');
      setUser(res.data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      showToast.success('Logged out successfully!');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuth = () => useContext(AuthContext);
