import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { Theme } from "@/constants/theme";
import { usePatientList } from "@/features/patient/list/use-patient-list";

import { delayTone, useReturns } from "../returns/use-returns";
import { TOTAL_PATIENTS, todayRecords } from "./mocks";
import {
  Card,
  Chips,
  PatientRow,
  SeeAll,
  Tile,
  TileRow,
  dashboardStyles,
} from "./ui";

const WAITING = "Aguardando procedimento";

function openPatient(id: number) {
  router.push({ pathname: "/patients/[id]", params: { id: String(id) } });
}

// Dias desde a última consulta (dd/mm/aaaa), usados como tempo de espera.
function daysSince(date: string) {
  const [day, month, year] = date.split("/").map(Number);
  if (!year) return null;
  const diff = Date.now() - new Date(year, month - 1, day).getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

export function TodayTab() {
  const returns = useReturns();
  const waiting = usePatientList(WAITING, "");

  const waitingList = waiting.filteredPatients
    .map((patient) => ({ ...patient, days: daysSince(patient.lastVisit) }))
    .sort((a, b) => (b.days ?? -1) - (a.days ?? -1));

  return (
    <View style={dashboardStyles.tab}>
      <TileRow>
        <Tile
          value={TOTAL_PATIENTS}
          label="pacientes"
          onPress={() => router.push("/patients")}
        />
        <Tile
          value={returns.alerts.length}
          label="sem retorno"
          tone={returns.alerts.length > 0 ? "error" : "text"}
          loading={returns.isLoading}
          onPress={() => router.push("/dashboard/returns")}
        />
        <Tile
          value={waiting.total}
          label="aguardando procedimento"
          tone="warning"
          loading={waiting.isLoading}
          onPress={() =>
            router.push({ pathname: "/patients", params: { status: WAITING } })
          }
        />
      </TileRow>

      <Card title="Precisam de retorno">
        {returns.isLoading ? (
          <ActivityIndicator color={Theme.primary} />
        ) : returns.error ? (
          <ThemedText themeColor="error">{returns.error}</ThemedText>
        ) : returns.alerts.length === 0 ? (
          <ThemedText themeColor="textSecondary">
            Nenhuma paciente atrasada.
          </ThemedText>
        ) : (
          <>
            {returns.alerts.slice(0, 4).map((alert) => (
              <PatientRow
                key={`${alert.idPaciente}-${alert.tipoAlerta}`}
                name={alert.nome}
                detail={alert.reason}
                days={`${alert.diasAtraso} dias`}
                tone={delayTone(alert.diasAtraso)}
                onPress={() => openPatient(alert.idPaciente)}
              />
            ))}
            <SeeAll
              count={returns.alerts.length}
              onPress={() => router.push("/dashboard/returns")}
            />
          </>
        )}
      </Card>

      <Card title="Aguardando procedimento">
        {waiting.isLoading ? (
          <ActivityIndicator color={Theme.primary} />
        ) : waiting.error ? (
          <ThemedText themeColor="error">{waiting.error}</ThemedText>
        ) : waitingList.length === 0 ? (
          <ThemedText themeColor="textSecondary">
            Nenhuma paciente aguardando.
          </ThemedText>
        ) : (
          <>
            {waitingList.slice(0, 3).map((patient) => (
              <PatientRow
                key={patient.id}
                name={patient.name}
                detail={`PRT ${patient.record}`}
                days={patient.days === null ? "Sem consultas" : `${patient.days} dias`}
                tone="warning"
                onPress={() => openPatient(patient.id)}
              />
            ))}
            <SeeAll
              count={waiting.total}
              onPress={() =>
                router.push({ pathname: "/patients", params: { status: WAITING } })
              }
            />
          </>
        )}
      </Card>

      <Card
        title={`Hoje · ${todayRecords.count} registros`}
        subtitle="Abertas recentemente"
      >
        <Chips items={todayRecords.recent} />
      </Card>
    </View>
  );
}
