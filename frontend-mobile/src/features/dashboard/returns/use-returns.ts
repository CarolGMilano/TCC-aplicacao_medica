import { useMemo } from "react";

import { usePostProcedure } from "../post-procedure/use-post-procedure";
import type { DashboardAlert } from "../types";
import { useWithoutReturn } from "../without-return/use-without-return";

export type ReturnAlert = DashboardAlert & { reason: string };

// Os dois alertas de retorno numa lista só, do maior atraso para o menor.
export function useReturns() {
  const withoutReturn = useWithoutReturn();
  const postProcedure = usePostProcedure();

  const alerts = useMemo<ReturnAlert[]>(
    () =>
      [
        ...withoutReturn.alerts.map((alert) => ({
          ...alert,
          reason: "Ver e tratar sem retorno",
        })),
        ...postProcedure.alerts.map((alert) => ({
          ...alert,
          reason: "Pós-procedimento sem retorno",
        })),
      ]
        .sort((a, b) => b.diasAtraso - a.diasAtraso)
        // Uma linha por paciente: com os dois alertas, fica o maior atraso e
        // os dois motivos.
        .reduce<ReturnAlert[]>((merged, alert) => {
          const same = merged.find(
            (item) => item.idPaciente === alert.idPaciente,
          );
          if (same) same.reason = `${same.reason} · ${alert.reason}`;
          else merged.push({ ...alert });
          return merged;
        }, []),
    [withoutReturn.alerts, postProcedure.alerts],
  );

  return {
    alerts,
    withoutReturnCount: withoutReturn.alerts.length,
    postProcedureCount: postProcedure.alerts.length,
    error: withoutReturn.error || postProcedure.error,
    isLoading: withoutReturn.isLoading || postProcedure.isLoading,
  };
}

// Mais de 4 meses de atraso: vermelho; antes disso, amarelo.
export function delayTone(days: number) {
  return days > 120 ? "error" : "warning";
}
