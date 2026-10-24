import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav, useBottomNavHeight } from "@/components/shared/bottom-nav";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { DashboardHeader } from "@/features/dashboard/home/dashboard-header";
import { TOTAL_PATIENTS } from "@/features/dashboard/home/mocks";
import {
  Card,
  PatientRow,
  SeeAll,
  dashboardStyles,
} from "@/features/dashboard/home/ui";
import { usePostProcedure } from "@/features/dashboard/post-procedure/use-post-procedure";
import type { DashboardAlert } from "@/features/dashboard/types";
import { useWithoutReturn } from "@/features/dashboard/without-return/use-without-return";

type AlertRoute = "/dashboard/without-return" | "/dashboard/post-procedure";

// Como na especificação: total de pacientes e as duas listas de pacientes
// sem retorno. Cabeçalho e barra de baixo fixos; só o meio rola.
export default function DashboardScreen() {
  const withoutReturn = useWithoutReturn();
  const postProcedure = usePostProcedure();
  const bottomNavHeight = useBottomNavHeight();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.screen}>
        <DashboardHeader />
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: bottomNavHeight + Spacing.five },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Card title="Pacientes cadastradas">
            <ThemedText style={dashboardStyles.bigValue}>
              {TOTAL_PATIENTS}
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/patients")}
              style={({ pressed }) => [styles.link, pressed && styles.pressed]}
            >
              <ThemedText style={styles.linkText}>Ver lista</ThemedText>
            </Pressable>
          </Card>

          <AlertCard
            title="Ver e tratar sem retorno"
            description="Indicação de ver e tratar há mais de 2 meses sem nova consulta registrada."
            state={withoutReturn}
            route="/dashboard/without-return"
          />
          <AlertCard
            title="Pós-procedimento sem retorno"
            description="EZT ou biópsia realizada há mais de 3 meses sem consulta de acompanhamento."
            state={postProcedure}
            route="/dashboard/post-procedure"
          />
        </ScrollView>
        <BottomNav />
      </ThemedView>
    </SafeAreaView>
  );
}

// Lista de alerta: as primeiras pacientes (nome, PRT e dias de atraso), cada
// uma abrindo a ficha, e "Ver todas" com a lista completa.
function AlertCard({
  title,
  description,
  state,
  route,
}: {
  title: string;
  description: string;
  state: { alerts: DashboardAlert[]; error: string; isLoading: boolean };
  route: AlertRoute;
}) {
  const { alerts, error, isLoading } = state;

  return (
    <Card title={title} subtitle={description}>
      {isLoading ? (
        <ActivityIndicator color={Theme.primary} />
      ) : error ? (
        <ThemedText themeColor="error">{error}</ThemedText>
      ) : alerts.length === 0 ? (
        <ThemedText themeColor="textSecondary">
          Nenhuma paciente atrasada.
        </ThemedText>
      ) : (
        <>
          {alerts.slice(0, 3).map((alert) => (
            <PatientRow
              key={`${alert.idPaciente}-${alert.tipoAlerta}`}
              name={alert.nome}
              detail={`PRT ${alert.prontuario}`}
              days={`${alert.diasAtraso} dias`}
              // Mais de 4 meses de atraso: vermelho; antes disso, amarelo.
              tone={alert.diasAtraso > 120 ? "error" : "warning"}
              onPress={() =>
                router.push({
                  pathname: "/patients/[id]",
                  params: { id: String(alert.idPaciente) },
                })
              }
            />
          ))}
          <SeeAll count={alerts.length} onPress={() => router.push(route)} />
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 21,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  link: {
    alignSelf: "flex-start",
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    backgroundColor: Theme.inputBackground,
  },
  linkText: {
    color: Theme.primary,
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.action,
  },
  pressed: { opacity: 0.7 },
});
