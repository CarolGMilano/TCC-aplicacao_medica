import { useEffect, useState } from "react";

import { fetchPostProcedureAlerts } from "../services/dashboard-alerts-api";
import type { PostProcedureAlert } from "./types";

export function usePostProcedure() {
  const [alerts, setAlerts] = useState<PostProcedureAlert[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPostProcedureAlerts()
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
