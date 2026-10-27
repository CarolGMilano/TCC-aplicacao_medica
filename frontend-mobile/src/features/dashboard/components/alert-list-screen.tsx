import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";

import { PillButton } from "@/components/shared/pill-button";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";

import type { DashboardAlert } from "../types";

type AlertListScreenProps = {
  title: string;
  eyebrow?: string;
  // Cor do filete ao lado do eyebrow: a mesma do card do dashboard que abriu
  // a tela (vermelho em "Sem retorno", amarelo em "Aguardando").
  accent?: string;
  // Texto no lugar de "N dias" (ex.: "Sem consultas").
  daysLabel?: (alert: DashboardAlert) => string;
  // Conteúdo extra depois da lista (ex.: "Último exame há mais de 1 ano").
  footer?: ReactNode;
  description: string;
  alerts: DashboardAlert[];
  totalPatients: number;
  error: string;
  isLoading: boolean;
};

export function AlertListScreen({
  title,
  eyebrow,
  accent = Theme.tertiary,
  daysLabel = (alert) => `${daysLabel(alert)}`,
  footer,
  description,
  alerts,
  totalPatients,
  error,
  isLoading,
}: AlertListScreenProps) {
  const percentage = totalPatients
    ? ((alerts.length / totalPatients) * 100).toLocaleString("pt-BR", {
        maximumFractionDigits: 1,
      })
    : "0";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <PillButton
            label="Dashboard"
            accessibilityLabel="Voltar para o Dashboard"
            onPress={() => router.dismissTo("/dashboard")}
            style={styles.backButton}
          />

          <View style={styles.heading}>
            <View style={styles.eyebrow}>
              <View style={[styles.line, { backgroundColor: accent }]} />
              <ThemedText type="code" themeColor="textSecondary">
                {eyebrow ??
                  (title === "Ver e tratar"
                    ? "Sem retorno"
                    : "Pós-procedimento")}
              </ThemedText>
            </View>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {!isLoading && !error ? (
              <ThemedText type="small" themeColor="textSecondary">
                {alerts.length} pacientes · {percentage}% das cadastradas
              </ThemedText>
            ) : null}
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={styles.description}
            >
              {description}
            </ThemedText>
          </View>

          {isLoading ? (
            <ActivityIndicator
              accessibilityLabel="Carregando pacientes"
              color={Theme.primary}
              style={styles.loading}
            />
          ) : error ? (
            <ThemedText themeColor="error" style={styles.message}>
              {error}
            </ThemedText>
          ) : alerts.length === 0 ? (
            <ThemedText style={styles.message}>
              Nenhuma paciente encontrada.
            </ThemedText>
          ) : (
            // Uma lista só, dentro de um card, como no protótipo.
            <View style={styles.listCard}>
              {alerts.map((alert, index) => (
                <Pressable
                  key={`${alert.idPaciente}-${alert.tipoAlerta}`}
                  accessibilityRole="button"
                  onPress={() =>
                    router.push({
                      pathname: "/patients/[id]",
                      params: { id: String(alert.idPaciente) },
                    })
                  }
                  style={({ pressed }) => [
                    styles.patientRow,
                    index > 0 && styles.divider,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.identity}>
                    <ThemedText style={styles.name}>{alert.nome}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {"reason" in alert && typeof alert.reason === "string"
                        ? alert.reason
                        : `PRT ${alert.prontuario}`}
                    </ThemedText>
                  </View>
                  <View style={styles.delay}>
                    {/* Mais de 4 meses de atraso: vermelho; antes, amarelo. */}
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
            </View>
          )}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  screen: {
    flex: 1,
  },

  content: {
    paddingBottom: 24,
  },
  backButton: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.one,
  },

  heading: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.one,
  },

  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },

  line: {
    width: 20,
    height: 3,
  },

  title: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.heading,
    lineHeight: Typography.lineHeights.title,
  },

  description: {
    marginTop: Spacing.one,
  },

  listCard: {
    marginHorizontal: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Theme.border,
    backgroundColor: Theme.backgroundElement,
  },

  patientRow: {
    minHeight: 64,
    paddingVertical: Spacing.two + Spacing.one,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },

  // flexShrink: nome longo (vem da API) quebra a linha em vez de empurrar
  // os dias para fora da tela.
  identity: {
    flexShrink: 1,
    gap: Spacing.half,
  },

  divider: {
    borderTopWidth: 1,
    borderTopColor: Theme.border,
  },

  footer: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
  },

  name: { fontFamily: FontFamilies.primaryMedium },

  delay: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },

  days: {
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.action,
  },

  loading: {
    marginTop: Spacing.four,
  },

  message: {
    padding: Spacing.four,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.7,
  },
});
