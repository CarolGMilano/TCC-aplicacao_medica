import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { PillButton } from "@/components/shared/pill-button";
import { ThemedText } from "@/components/shared/themed-text";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { logout } from "@/features/auth/auth-session";

import { doctor } from "./mocks";

export type DashboardTab = "today" | "indicators";

const tabs: { id: DashboardTab; label: string }[] = [
  { id: "today", label: "Indicadores" },
  { id: "indicators", label: "Exames" },
];

// Cabeçalho fixo: só o conteúdo da aba rola por baixo dele.
export function DashboardHeader({
  tab,
  onChangeTab,
}: {
  tab: DashboardTab;
  onChangeTab: (tab: DashboardTab) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View>
          <ThemedText type="small" themeColor="textSecondary">
            {doctor.date}
          </ThemedText>
          <ThemedText style={styles.name}>{doctor.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {doctor.crm}
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

      <View style={styles.segmented} accessibilityRole="tablist">
        {tabs.map(({ id, label }) => {
          const active = id === tab;
          return (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => onChangeTab(id)}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <ThemedText
                style={[styles.segmentText, active && styles.segmentTextActive]}
              >
                {label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 21,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
    backgroundColor: Theme.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.inputBorder,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.greeting,
    lineHeight: Typography.lineHeights.greeting,
    marginTop: Spacing.one,
  },
  segmented: {
    flexDirection: "row",
    borderRadius: 22,
    padding: Spacing.one,
    backgroundColor: Theme.inputBackground,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: { backgroundColor: Theme.primary },
  segmentText: {
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.action,
  },
  segmentTextActive: {
    color: Theme.textPrimaryLight,
    fontFamily: FontFamilies.primarySemiBold,
  },
});
