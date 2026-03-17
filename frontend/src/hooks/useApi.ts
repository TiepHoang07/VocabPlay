import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { api } from "../api/client";

export const useApi = () => {
  const { getToken } = useAuth();

  const authRequest = useCallback(async (method: string, url: string, data?: any) => {
    const token = await getToken();

    return api({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [getToken]);

  return { authRequest };
};