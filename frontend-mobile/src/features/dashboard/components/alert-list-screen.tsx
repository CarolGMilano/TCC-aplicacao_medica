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

import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";

import type { DashboardAlert } from "../types";

type AlertListScreenProps = {
  title: string;
  description: string;
  alerts: DashboardAlert[];
  totalPatients: number;
  error: string;
  isLoading: boolean;
};

export function AlertListScreen({
  title,
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar para o Dashboard"
            hitSlop={8}
            onPress={() => router.replace("/dashboard")}
            style={styles.backButton}
          >
            <SymbolView
              name={{
                ios: "arrow.left",
                android: "arrow_back",
                web: "arrow_back",
              }}
              tintColor={Theme.textSecondary}
              size={18}
            />
            <ThemedText type="code" themeColor="textSecondary">
              DASHBOARD
            </ThemedText>
          </Pressable>

          <View style={styles.heading}>
            <View style={styles.eyebrow}>
              <ThemedView type="tertiary" style={styles.line} />
              <ThemedText type="code" themeColor="textSecondary">
                {title === "Ver e tratar" ? "SEM RETORNO" : "PÓS-PROCEDIMENTO"}
              </ThemedText>
            </View>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText type="code" themeColor="textSecondary">
              {alerts.length} PACIENTES · {percentage}% DAS CADASTRADAS
            </ThemedText>
            <ThemedText style={styles.description} themeColor="textSecondary">
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
            alerts.map((alert) => (
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
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.identity}>
                  <ThemedText style={styles.name}>{alert.nome}</ThemedText>
                  <ThemedText type="subtitle" themeColor="textSecondary">
                    PRT {alert.prontuario}
                  </ThemedText>
                </View>
                <View style={styles.delay}>
                  <ThemedText themeColor="error" style={styles.days}>
                    {alert.diasAtraso} d
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
            ))
          )}
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
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },

  heading: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.one,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
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
    fontSize: Typography.sizes.greeting,
    lineHeight: Typography.lineHeights.greeting,
  },

  description: {
    fontSize: Typography.sizes.small,
    lineHeight: Typography.lineHeights.compact,
    marginTop: Spacing.one,
  },

  patientRow: {
    minHeight: 69,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: Theme.backgroundElement,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  identity: {
    gap: 3,
  },

  name: {
    fontSize: Typography.sizes.bodySmall,
  },

  delay: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },

  days: {
    fontSize: Typography.sizes.bodySmall,
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
