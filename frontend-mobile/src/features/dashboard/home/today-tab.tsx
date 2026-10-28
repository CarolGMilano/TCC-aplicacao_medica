import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { Theme } from "@/constants/theme";
import { usePatientList } from "@/features/patient/list/use-patient-list";
import { statusColors } from "@/features/patient/record/constants";
import { statusMap } from "@/features/patient/registration/constants";

import { useReturns } from "../returns/use-returns";
import {
  fetchAttended,
  fetchStatusCounts,
  fetchTotalPatients,
} from "../services/indicators-api";
import { Bars, Card, Segments, Tile, TileRow, dashboardStyles } from "./ui";
import { useRequest } from "./use-request";

const WAITING = "Aguardando procedimento";

type Period = "hoje" | "semana" | "mes";

const periods: { id: Period; label: string }[] = [
  { id: "hoje", label: "Hoje" },
  { id: "semana", label: "Semana" },
  { id: "mes", label: "Mês" },
];

// Texto da tela para o status do backend (EM_INVESTIGACAO -> Em investigação).
const statusLabels = Object.fromEntries(
  Object.entries(statusMap).map(([label, value]) => [value, label]),
);

export function TodayTab() {
  const [period, setPeriod] = useState<Period>("hoje");
  const returns = useReturns();
  const waiting = usePatientList(WAITING, "");
  const total = useRequest(fetchTotalPatients);
  const attended = useRequest(fetchAttended);
  const byStatus = useRequest(fetchStatusCounts);

  return (
    <View style={dashboardStyles.tab}>
      <TileRow>
        <Tile
          value={total.data ?? "—"}
          label="Pacientes"
          loading={total.isLoading}
          onPress={() => router.push("/patients")}
        />
        <Tile
          value={returns.alerts.length}
          label="Sem retorno"
          tone={returns.alerts.length > 0 ? "error" : "text"}
          loading={returns.isLoading}
          onPress={() => router.push("/dashboard/returns")}
        />
        <Tile
          value={waiting.total}
          label="Aguardando procedimento"
          tone="warning"
          loading={waiting.isLoading}
          onPress={() => router.push("/dashboard/waiting")}
        />
      </TileRow>

      <Card title="Pacientes atendidas">
        <Segments options={periods} value={period} onChange={setPeriod} />
        {attended.isLoading ? (
          <ActivityIndicator color={Theme.primary} />
        ) : attended.error ? (
          <ThemedText themeColor="error">{attended.error}</ThemedText>
        ) : (
          <ThemedText style={dashboardStyles.bigValue}>
            {attended.data?.[period] ?? 0}
          </ThemedText>
        )}
        <ThemedText type="small" themeColor="textSecondary">
          Com consulta ou exame registrado no período
        </ThemedText>
      </Card>

      <Card
        title={`${byStatus.data?.total ?? ""} pacientes por situação`.trim()}
        subtitle="Situação atual de cada paciente na ficha. Toque para ver a lista."
      >
        {byStatus.isLoading ? (
          <ActivityIndicator color={Theme.primary} />
        ) : byStatus.error ? (
          <ThemedText themeColor="error">{byStatus.error}</ThemedText>
        ) : (
          <Bars
            items={(byStatus.data?.situacoes ?? []).map(({ status, total }) => {
              const label = statusLabels[status] ?? status;
              return {
                label,
                count: total,
                color: statusColors[label]?.text ?? Theme.border,
                onPress: () =>
                  router.push({
                    pathname: "/patients",
                    params: { status: label },
                  }),
              };
            })}
          />
        )}
      </Card>
    </View>
  );
}
