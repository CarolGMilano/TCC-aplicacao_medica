import { API_BASE_URL } from "@/features/auth/services/auth-api";

import { mockPostProcedureAlerts } from "../post-procedure/mocks";
import type { PostProcedureAlert } from "../post-procedure/types";
import { mockWithoutReturnAlerts } from "../without-return/mocks";
import type { WithoutReturnAlert } from "../without-return/types";

export const USE_MOCK_DASHBOARD_ALERTS = true;

export async function fetchWithoutReturnAlerts(): Promise<WithoutReturnAlert[]> {
  if (USE_MOCK_DASHBOARD_ALERTS) {
    return mockWithoutReturnAlerts.map((alert) => ({ ...alert }));
  }

  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/alertas/ver-e-tratar`,
  );
  if (!response.ok) {
    throw new Error("Não foi possível carregar as pacientes sem retorno.");
  }
  return (await response.json()) as WithoutReturnAlert[];
}

export async function fetchPostProcedureAlerts(): Promise<
  PostProcedureAlert[]
> {
  if (USE_MOCK_DASHBOARD_ALERTS) {
    return mockPostProcedureAlerts.map((alert) => ({ ...alert }));
  }

  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/alertas/pos-procedimento`,
  );
  if (!response.ok) {
    throw new Error("Não foi possível carregar as pacientes pós-procedimento.");
  }
  return (await response.json()) as PostProcedureAlert[];
}
