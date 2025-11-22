/*
import { useState, useEffect } from "react";
import { refreshToken } from "../services/authService";

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!token) return;
      const data = await refreshToken();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        setToken(null);
        localStorage.removeItem("token");
      }
    }, 14 * 60 * 1000); // refresh every 14 min (before 15 min expiry)
    return () => clearInterval(interval);
  }, [token]);

  return { token, setToken };
}
*/