import { useEffect, useState } from "react";

import { fetchWithoutReturnAlerts } from "../services/dashboard-alerts-api";
import type { WithoutReturnAlert } from "./types";

export function useWithoutReturn() {
  const [alerts, setAlerts] = useState<WithoutReturnAlert[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchWithoutReturnAlerts()
      .then((result) => {
        if (active) setAlerts(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar as pacientes.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { alerts, error, isLoading };
}
