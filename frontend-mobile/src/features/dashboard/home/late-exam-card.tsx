import { useState } from "react";
import { ActivityIndicator } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { Theme } from "@/constants/theme";

import { fetchNoRecentExam } from "../services/indicators-api";
import { Card, PatientRow, Segments } from "./ui";
import { useRequest } from "./use-request";
import { openPatient } from "./utils";

// Prazo sem exame; o padrão é 1 ano.
type Years = "1" | "2" | "3";

const yearOptions: { id: Years; label: string }[] = [
  { id: "1", label: "1 ano" },
  { id: "2", label: "2 anos" },
  { id: "3", label: "3 anos" },
];

// "2022-03-14" -> "14/03/2022".
function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function yearsSince(value: string) {
  const years = Math.floor(
    (Date.now() - new Date(`${value}T00:00:00`).getTime()) /
      (365.25 * 86_400_000),
  );
  return years === 1 ? "1 ano" : `${years} anos`;
}

// "Último exame há mais de N anos" (citologia ou PCR), na tela de pacientes
// sem retorno. Quem nunca fez exame vem primeiro.
export function LateExamCard() {
  const [years, setYears] = useState<Years>("1");
  const { data, error, isLoading } = useRequest(
    () => fetchNoRecentExam(Number(years)),
    years,
  );

  return (
    <Card
      title={`Último exame há mais de ${years === "1" ? "1 ano" : `${years} anos`}`}
    >
      <Segments options={yearOptions} value={years} onChange={setYears} />
      {isLoading ? (
        <ActivityIndicator color={Theme.primary} />
      ) : error ? (
        <ThemedText themeColor="error">{error}</ThemedText>
      ) : !data || data.length === 0 ? (
        <ThemedText themeColor="textSecondary">
          Nenhuma paciente nesse prazo.
        </ThemedText>
      ) : (
        data
          .slice(0, 5)
          .map((patient) => (
            <PatientRow
              key={patient.idPaciente}
              name={patient.nome}
              detail={
                patient.ultimoExame
                  ? `Último exame em ${formatDate(patient.ultimoExame)}`
                  : "Nenhum exame registrado"
              }
              days={
                patient.ultimoExame ? yearsSince(patient.ultimoExame) : "Nunca"
              }
              tone="warning"
              onPress={() => openPatient(patient.idPaciente)}
            />
          ))
      )}
    </Card>
  );
}
