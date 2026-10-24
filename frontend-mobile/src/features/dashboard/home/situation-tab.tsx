import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { Theme } from "@/constants/theme";
import { usePatientList } from "@/features/patient/list/use-patient-list";
import { statusColors } from "@/features/patient/record/constants";

import { useReturns } from "../returns/use-returns";
import { TOTAL_PATIENTS, changedWithoutNextStep, statusCounts } from "./mocks";
import {
  Bars,
  Card,
  PatientRow,
  Segments,
  Tile,
  TileRow,
  dashboardStyles,
} from "./ui";
import { daysSince, openPatient } from "./utils";

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
  const all = usePatientList("Todas", "");

  // Pela última consulta registrada; quem nunca teve consulta vem primeiro.
  const late = all.patients
    .map((patient) => ({ ...patient, days: daysSince(patient.lastVisit) }))
    .filter((patient) => patient.days === null || patient.days > Number(years) * 365)
    .sort((a, b) => (b.days ?? Infinity) - (a.days ?? Infinity));

  // Resultados ainda fictícios, presos a pacientes reais para abrir a ficha.
  const changed = changedWithoutNextStep.map((item, index) => ({
    ...item,
    patient: all.patients[index],
  }));

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
        {changed.map(({ patient, ...item }) => (
          <PatientRow
            key={item.name}
            {...item}
            name={patient?.name ?? item.name}
            tone="warning"
            onPress={patient ? () => openPatient(patient.id) : undefined}
          />
        ))}
      </Card>

      <Card
        title={`Último exame há mais de ${years === "1" ? "1 ano" : `${years} anos`}`}
      >
        <Segments options={yearOptions} value={years} onChange={setYears} />
        {all.isLoading ? (
          <ActivityIndicator color={Theme.primary} />
        ) : all.error ? (
          <ThemedText themeColor="error">{all.error}</ThemedText>
        ) : late.length === 0 ? (
          <ThemedText themeColor="textSecondary">
            Nenhuma paciente nesse prazo.
          </ThemedText>
        ) : (
          late.slice(0, 5).map((patient) => {
            const lateYears = Math.floor((patient.days ?? 0) / 365);
            return (
              <PatientRow
                key={patient.id}
                name={patient.name}
                detail={
                  patient.days === null
                    ? "Nenhuma consulta registrada"
                    : `Última consulta em ${patient.lastVisit}`
                }
                days={
                  patient.days === null
                    ? "Nunca"
                    : lateYears === 1
                      ? "1 ano"
                      : `${lateYears} anos`
                }
                tone="warning"
                onPress={() => openPatient(patient.id)}
              />
            );
          })
        )}
      </Card>
    </View>
  );
}
