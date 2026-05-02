import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Restore login safely on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("fixongo_user");

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem("fixongo_user");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  // ✅ Login
  const login = (userData) => {
    if (!userData) return;

    localStorage.setItem("fixongo_user", JSON.stringify(userData));
    setUser(userData);
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("fixongo_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
