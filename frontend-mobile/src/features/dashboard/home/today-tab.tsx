import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { Theme } from "@/constants/theme";
import { usePatientList } from "@/features/patient/list/use-patient-list";
import { statusColors } from "@/features/patient/record/constants";

import { useReturns } from "../returns/use-returns";
import { TOTAL_PATIENTS, attended, statusCounts } from "./mocks";
import { Bars, Card, Segments, Tile, TileRow, dashboardStyles } from "./ui";

const WAITING = "Aguardando procedimento";

type Period = "day" | "week" | "month";

const periods: { id: Period; label: string }[] = [
  { id: "day", label: "Hoje" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mês" },
];

export function TodayTab() {
  const [period, setPeriod] = useState<Period>("day");
  const returns = useReturns();
  const waiting = usePatientList(WAITING, "");

  return (
    <View style={dashboardStyles.tab}>
      <TileRow>
        <Tile
          value={TOTAL_PATIENTS}
          label="Pacientes"
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
          onPress={() =>
            router.push({ pathname: "/patients", params: { status: WAITING } })
          }
        />
      </TileRow>

      <Card title="Pacientes atendidas">
        <Segments options={periods} value={period} onChange={setPeriod} />
        <ThemedText style={dashboardStyles.bigValue}>
          {attended[period]}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Com consulta ou exame registrado no período
        </ThemedText>
      </Card>

      <Card
        title={`${TOTAL_PATIENTS} pacientes por situação`}
        subtitle="Situação atual de cada paciente na ficha. Toque para ver a lista."
      >
        <Bars
          items={statusCounts.map(({ status, count }) => ({
            label: status,
            count,
            color: statusColors[status]?.text ?? Theme.border,
            onPress: () =>
              router.push({ pathname: "/patients", params: { status } }),
          }))}
        />
      </Card>
    </View>
  );
}
