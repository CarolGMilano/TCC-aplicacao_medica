import { SymbolView } from "expo-symbols";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/shared/bottom-nav";
import { PillButton } from "@/components/shared/pill-button";
import { ThemedView } from "@/components/shared/themed-view";
import { logout } from "@/features/auth/auth-session";
import { usePostProcedure } from "@/features/dashboard/post-procedure/use-post-procedure";
import type { WithoutReturnAlert as AlertItem } from "@/features/dashboard/without-return/types";
import { useWithoutReturn } from "@/features/dashboard/without-return/use-without-return";
import { router } from "expo-router";
import { ThemedText } from "@/components/shared/themed-text";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { statusColors } from "@/features/patient/record/constants";
import { statusMap } from "@/features/patient/registration/constants";

// O alerta traz o status como enum do backend (ou já como texto, no mock).
function statusLabel(status: string) {
  return (
    Object.keys(statusMap).find((label) => statusMap[label] === status) ??
    status
  );
}

// Total ainda fixo (como o card "Pacientes cadastradas"); usado só no
// percentual dos alertas.
const TOTAL_PATIENTS = 248;

export default function DashboardScreen() {
  const withoutReturn = useWithoutReturn();
  const postProcedure = usePostProcedure();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">
                Qui, 04 set
              </ThemedText>
              <ThemedText style={styles.greeting}>Ana Ribeiro</ThemedText>
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={styles.crm}
              >
                CRM 118 402
              </ThemedText>
            </View>
            <PillButton
              label="Sair"
              icon="logout"
              onPress={() => {
                logout();
                // Sem limpar a pilha, o voltar do Android reabre telas da sessão.
                if (router.canDismiss()) {
                  router.dismissAll();
                }
                router.replace("/");
              }}
            />
          </View>

          {/* O que precisa de atenção vem primeiro: um número grande por
              alerta, em coral quando há pacientes atrasadas. */}
          <View>
            <ThemedText style={styles.sectionTitle}>Precisa de atenção</ThemedText>
            <View style={styles.attentionRow}>
              <AttentionTile
                count={withoutReturn.alerts.length}
                loading={withoutReturn.isLoading}
                label="Ver e tratar sem retorno"
                route="/dashboard/without-return"
              />
              <AttentionTile
                count={postProcedure.alerts.length}
                loading={postProcedure.isLoading}
                label="Pós-procedimento sem retorno"
                route="/dashboard/post-procedure"
              />
            </View>
          </View>

          <StatusOverview />

          <ReturnCard
            title="Ver e tratar sem retorno"
            description="Indicação de ver e tratar há mais de 2 meses sem nova consulta registrada."
            state={withoutReturn}
            route="/dashboard/without-return"
          />
          <ReturnCard
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

function AttentionTile({
  count,
  loading,
  label,
  route,
}: {
  count: number;
  loading: boolean;
  label: string;
  route: "/dashboard/without-return" | "/dashboard/post-procedure";
}) {
  const late = count > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${count} pacientes`}
      onPress={() => router.push(route)}
      style={({ pressed }) => [
        styles.tile,
        late && styles.tileLate,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Theme.primary} style={styles.tileLoading} />
      ) : (
        <ThemedText
          style={styles.tileCount}
          themeColor={late ? "error" : "textSecondary"}
        >
          {count}
        </ThemedText>
      )}
      <ThemedText type="small" style={styles.tileLabel}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

// Pacientes por situação, ainda com números fixos (como o total), somando
// TOTAL_PATIENTS. Tocar numa situação abre a lista já filtrada.
const statusCounts: { status: string; count: number }[] = [
  { status: "Em investigação", count: 52 },
  { status: "Aguardando procedimento", count: 38 },
  { status: "Em tratamento", count: 27 },
  { status: "Pós-procedimento", count: 41 },
  { status: "Acompanhamento preventivo", count: 71 },
  { status: "Alta", count: 19 },
];

function StatusOverview() {
  return (
    <ThemedView
      type="backgroundElement"
      borderColor="border"
      style={styles.statusCard}
    >
      <View style={styles.statusHeader}>
        <ThemedText style={styles.cardTitle}>Pacientes por situação</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {TOTAL_PATIENTS} no total
        </ThemedText>
      </View>

      <View style={styles.bar}>
        {statusCounts.map(({ status, count }) => (
          <View
            key={status}
            style={{
              flex: count,
              backgroundColor: statusColors[status]?.text ?? Theme.border,
            }}
          />
        ))}
      </View>

      {statusCounts.map(({ status, count }) => (
        <Pressable
          key={status}
          accessibilityRole="button"
          accessibilityLabel={`${status}: ${count} pacientes`}
          onPress={() => router.push({ pathname: "/patients", params: { status } })}
          style={({ pressed }) => [styles.statusRow, pressed && styles.pressed]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: statusColors[status]?.text ?? Theme.border },
            ]}
          />
          <ThemedText style={styles.statusLabel}>{status}</ThemedText>
          <ThemedText style={styles.statusCount}>{count}</ThemedText>
          <SymbolView
            name={{
              ios: "chevron.right",
              android: "chevron_right",
              web: "chevron_right",
            }}
            tintColor={Theme.textSecondary}
            size={16}
          />
        </Pressable>
      ))}
    </ThemedView>
  );
}

// Alertas reais (mesmos dados do "Ver todas"): as duas primeiras pacientes,
// cada uma abrindo a própria ficha.
function ReturnCard({
  title,
  description,
  state,
  route,
}: {
  title: string;
  description: string;
  state: { alerts: AlertItem[]; error: string; isLoading: boolean };
  route: "/dashboard/without-return" | "/dashboard/post-procedure";
}) {
  const { alerts, error, isLoading } = state;
  const percentage = ((alerts.length / TOTAL_PATIENTS) * 100).toLocaleString(
    "pt-BR",
    { maximumFractionDigits: 1 },
  );

  return (
    <ThemedView
      type="backgroundElement"
      style={styles.returnCard}
      borderColor="border"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir lista: ${title}`}
        onPress={() => router.push(route)}
        style={({ pressed }) => [styles.returnHeader, pressed && styles.pressed]}
      >
        <ThemedView type="tertiary" style={styles.line} />
        <ThemedText style={styles.returnTitle}>{title}</ThemedText>
      </Pressable>
      <ThemedText
        type="small"
        style={styles.description}
        themeColor="textSecondary"
      >
        {description}
      </ThemedText>
      {isLoading ? (
        <ActivityIndicator color={Theme.primary} style={styles.count} />
      ) : (
        <ThemedText
          type="small"
          themeColor={error ? "error" : "textSecondary"}
          style={styles.count}
        >
          {error ||
            `${alerts.length} pacientes · ${percentage}% das cadastradas`}
        </ThemedText>
      )}
      {alerts.slice(0, 2).map((alert) => (
        <Pressable
          key={`${alert.idPaciente}-${alert.tipoAlerta}`}
          accessibilityRole="button"
          accessibilityLabel={`Abrir ficha de ${alert.nome}`}
          onPress={() =>
            router.push({
              pathname: "/patients/[id]",
              params: { id: String(alert.idPaciente) },
            })
          }
          style={({ pressed }) => [styles.patientRow, pressed && styles.pressed]}
        >
          <View style={styles.identity}>
            <ThemedText style={styles.name}>{alert.nome}</ThemedText>
            <ThemedText type="small" themeColor="muted">
              PRT {alert.prontuario}
              {alert.status ? ` · ${statusLabel(alert.status)}` : ""}
            </ThemedText>
          </View>
          <View style={styles.daysRow}>
            {/* Mais de 4 meses de atraso: vermelho; antes disso, amarelo. */}
            <ThemedText
              themeColor={alert.diasAtraso > 120 ? "error" : "warning"}
              style={styles.days}
            >
              {alert.diasAtraso} dias
            </ThemedText>
            <SymbolView
              name={{
                ios: "chevron.right",
                android: "chevron_right",
                web: "chevron_right",
              }}
              tintColor={Theme.textSecondary}
              size={16}
            />
          </View>
        </Pressable>
      ))}
      {alerts.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver todas: ${title}`}
          onPress={() => router.push(route)}
          style={({ pressed }) => [styles.more, pressed && styles.pressed]}
        >
          <ThemedText style={styles.linkText}>
            Ver todas · {alerts.length}
          </ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },

  content: {
    paddingHorizontal: 21,
    paddingBottom: 130,
    gap: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 4,
    paddingBottom: 12,
  },

  greeting: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.greeting,
    lineHeight: Typography.lineHeights.greeting,
    marginTop: 6,
  },

  crm: { marginTop: 3 },

  sectionTitle: {
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.section,
    lineHeight: Typography.lineHeights.body,
    marginBottom: Spacing.two,
  },

  attentionRow: {
    flexDirection: "row",
    gap: Spacing.two + Spacing.one,
  },

  tile: {
    flex: 1,
    minHeight: 116,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Theme.border,
    backgroundColor: Theme.backgroundElement,
    padding: Spacing.three,
    gap: Spacing.one,
  },

  tileLate: {
    borderColor: Theme.secondary,
    backgroundColor: Theme.backgroundAlert,
  },

  tileCount: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.metric,
    lineHeight: Typography.lineHeights.metric,
  },

  tileLoading: {
    alignSelf: "flex-start",
    height: Typography.lineHeights.metric,
  },

  tileLabel: {
    fontFamily: FontFamilies.primaryMedium,
  },

  statusCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.two,
  },

  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: Spacing.two,
  },

  cardTitle: {
    flexShrink: 1,
    fontFamily: FontFamilies.primarySemiBold,
  },

  // Barra única dividida pela quantidade de cada situação.
  bar: {
    flexDirection: "row",
    height: 14,
    borderRadius: 7,
    overflow: "hidden",
    gap: 2,
    marginVertical: Spacing.one,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 44,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  statusLabel: { flex: 1 },

  statusCount: {
    fontFamily: FontFamilies.primarySemiBold,
  },

  line: {
    width: 18,
    height: 3,
  },

  linkText: {
    color: Theme.primary,
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.action,
    lineHeight: Typography.lineHeights.input,
  },

  name: { fontFamily: FontFamilies.primaryMedium },

  pressed: { opacity: 0.7 },

  returnCard: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },

  returnHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 16,
    paddingTop: 15,
  },

  // flexShrink: em seminegrito o título longo quebra a linha em vez de ser
  // cortado.
  returnTitle: { fontFamily: FontFamilies.primarySemiBold, flexShrink: 1 },

  description: {
    paddingHorizontal: 16,
    paddingTop: 7,
  },

  count: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  patientRow: {
    borderTopWidth: 1,
    borderTopColor: Theme.border,
    backgroundColor: Theme.backgroundElement,
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  identity: { flexShrink: 1 },

  daysRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },

  days: {
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.action,
  },

  // Ação secundária com fundo suave, como os outros botões do app.
  more: {
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    margin: Spacing.three - Spacing.one,
    backgroundColor: Theme.inputBackground,
  },
});
