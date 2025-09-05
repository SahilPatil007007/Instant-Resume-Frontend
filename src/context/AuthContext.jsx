import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current user when app loads
  useEffect(() => {
    axios
      .get("/api/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Signup
  const signup = async (name, email, password) => {
    const res = await axios.post(
      "/api/auth/signup",
      { name, email, password },
      { withCredentials: true }
    );
    setUser(res.data); // set user from backend response
  };

  // Login
  const login = async (email, password) => {
    const res = await axios.post(
      "/api/auth/login",
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data);
  };

  // Logout
  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuth = () => useContext(AuthContext);
