import { useState } from "react";
import { ActivityIndicator } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { Theme } from "@/constants/theme";
import { usePatientList } from "@/features/patient/list/use-patient-list";

import { Card, PatientRow, Segments } from "./ui";
import { daysSince, openPatient } from "./utils";

// Prazo sem exame; o padrão é 1 ano.
type Years = "1" | "2" | "3";

const yearOptions: { id: Years; label: string }[] = [
  { id: "1", label: "1 ano" },
  { id: "2", label: "2 anos" },
  { id: "3", label: "3 anos" },
];

// "Último exame há mais de N anos", na tela de pacientes sem retorno.
export function LateExamCard() {
  const [years, setYears] = useState<Years>("1");
  const all = usePatientList("Todas", "");

  // Pela última consulta registrada; quem nunca teve consulta vem primeiro.
  const late = all.patients
    .map((patient) => ({ ...patient, days: daysSince(patient.lastVisit) }))
    .filter(
      (patient) => patient.days === null || patient.days > Number(years) * 365,
    )
    .sort((a, b) => (b.days ?? Infinity) - (a.days ?? Infinity));

  return (
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
  );
}
