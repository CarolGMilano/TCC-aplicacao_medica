import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { Theme } from "@/constants/theme";
import { statusColors } from "@/features/patient/record/constants";

import { useReturns } from "../returns/use-returns";
import {
  TOTAL_PATIENTS,
  changedWithoutNextStep,
  lateScreening,
  statusCounts,
} from "./mocks";
import {
  Bars,
  Card,
  PatientRow,
  Segments,
  Tile,
  TileRow,
  dashboardStyles,
} from "./ui";

// Prazo sem exame para o rastreio atrasado; o padrão é 1 ano.
type Years = "1" | "2" | "3";

const yearOptions: { id: Years; label: string }[] = [
  { id: "1", label: "1 ano" },
  { id: "2", label: "2 anos" },
  { id: "3", label: "3 anos" },
];

export function SituationTab() {
  const returns = useReturns();
  const [years, setYears] = useState<Years>("1");
  const late = lateScreening.filter((item) => item.years >= Number(years));

  return (
    <View style={dashboardStyles.tab}>
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

      <TileRow>
        <Tile
          value={returns.withoutReturnCount}
          label="Ver e tratar sem retorno"
          tone={returns.withoutReturnCount > 0 ? "error" : "text"}
          loading={returns.isLoading}
          onPress={() => router.push("/dashboard/without-return")}
        />
        <Tile
          value={returns.postProcedureCount}
          label="Pós-procedimento sem retorno"
          tone={returns.postProcedureCount > 0 ? "error" : "text"}
          loading={returns.isLoading}
          onPress={() => router.push("/dashboard/post-procedure")}
        />
      </TileRow>

      <Card
        title="Exame alterado sem retorno"
        subtitle="Último resultado alterado e nenhum atendimento registrado depois dele."
      >
        {changedWithoutNextStep.map((item) => (
          <PatientRow key={item.name} {...item} tone="warning" />
        ))}
      </Card>

      <Card
        title={`Último exame há mais de ${years === "1" ? "1 ano" : `${years} anos`}`}
      >
        <Segments options={yearOptions} value={years} onChange={setYears} />
        {late.length === 0 ? (
          <ThemedText themeColor="textSecondary">
            Nenhuma paciente nesse prazo.
          </ThemedText>
        ) : (
          late.map((item) => (
            <PatientRow
              key={item.name}
              name={item.name}
              detail={`Último exame em ${item.lastExam}`}
              days={item.years === 1 ? "1 ano" : `${item.years} anos`}
              tone="warning"
            />
          ))
        )}
      </Card>
    </View>
  );
}
