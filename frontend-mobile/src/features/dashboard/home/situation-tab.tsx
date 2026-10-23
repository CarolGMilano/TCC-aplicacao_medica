import { router } from "expo-router";
import { View } from "react-native";

import { Theme } from "@/constants/theme";
import { statusColors } from "@/features/patient/record/constants";

import { useReturns } from "../returns/use-returns";
import {
  TOTAL_PATIENTS,
  changedWithoutNextStep,
  lateScreening,
  monthMovement,
  priorityGroup,
  riskFactors,
  statusCounts,
} from "./mocks";
import {
  Bars,
  Card,
  PatientRow,
  StatRow,
  Tile,
  TileRow,
  dashboardStyles,
} from "./ui";

export function SituationTab() {
  const returns = useReturns();

  return (
    <View style={dashboardStyles.tab}>
      <Card title={`${TOTAL_PATIENTS} pacientes por situação`}>
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

      <TileRow>
        <Tile
          value={returns.withoutReturnCount}
          label="ver e tratar sem retorno"
          tone={returns.withoutReturnCount > 0 ? "error" : "text"}
          loading={returns.isLoading}
          onPress={() => router.push("/dashboard/without-return")}
        />
        <Tile
          value={returns.postProcedureCount}
          label="pós-proced. sem retorno"
          tone={returns.postProcedureCount > 0 ? "error" : "text"}
          loading={returns.isLoading}
          onPress={() => router.push("/dashboard/post-procedure")}
        />
      </TileRow>

      <Card title="Alterados sem próximo passo" tag="regra a validar">
        {changedWithoutNextStep.map((item) => (
          <PatientRow key={item.name} {...item} tone="warning" />
        ))}
      </Card>

      <Card
        title="Rastreio atrasado"
        subtitle="Sem exame há mais de 3 anos"
        tag="regra a validar"
      >
        {lateScreening.map((item) => (
          <PatientRow key={item.name} {...item} tone="warning" />
        ))}
      </Card>

      <Card title="Grupo prioritário">
        {priorityGroup.map((item) => (
          <StatRow key={item.label} {...item} />
        ))}
      </Card>

      <Card title="Fatores de risco">
        {riskFactors.map((item) => (
          <StatRow key={item.label} {...item} />
        ))}
      </Card>

      <Card title="Movimento em outubro">
        {monthMovement.map((item) => (
          <StatRow key={item.label} {...item} />
        ))}
      </Card>
    </View>
  );
}
