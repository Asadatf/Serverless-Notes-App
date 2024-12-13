import { useState } from "react";
import { useAuthContext } from "./useAuthContext.js";
import { API_ROUTES } from "../constants.js";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(API_ROUTES.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      const userWithDetails = {
        ...json,
        email: json.email,
        pic: json.pic,
      };

      localStorage.setItem("user", JSON.stringify(userWithDetails));

      dispatch({ type: "LOGIN", payload: userWithDetails });

      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};
