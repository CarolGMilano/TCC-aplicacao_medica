import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/shared/bottom-nav";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";
import { logout } from "@/features/auth/auth-session";
import { FontFamilies, Theme, Typography } from "@/constants/theme";
import { router } from "expo-router";

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.date}>QUI, 04 SET</ThemedText>
              <ThemedText style={styles.greeting}>Ana Ribeiro</ThemedText>
              <ThemedText style={styles.crm}>CRM 118 402</ThemedText>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                logout();
                router.replace("/");
              }}
              style={styles.exit}
            >
              <ThemedText style={styles.exitText}>SAIR</ThemedText>
            </Pressable>
          </View>

          <ThemedView
            style={styles.totalCard}
            type="backgroundElement"
            borderColor="border"
          >
            <View style={styles.cardLabel}>
              <ThemedView type="tertiary" style={styles.line} />
              <ThemedText style={styles.cardLabelText}>
                PACIENTES CADASTRADAS
              </ThemedText>
            </View>
            <ThemedText style={styles.total}>248</ThemedText>
            <View style={styles.cardFooter}>
              <ThemedText themeColor="textSecondary">
                Total na unidade
              </ThemedText>
              <ThemedText themeColor="primary">VER LISTA →</ThemedText>
            </View>
          </ThemedView>

          <ReturnCard
            title="Ver e tratar sem retorno"
            description="Indicação de ver e tratar há mais de 2 meses sem nova consulta registrada."
            count="12 PACIENTES  ·  4,8% DAS CADASTRADAS"
            names={["Cláudia Nunes", "Marina Souza"]}
            days={["146 d", "134 d"]}
          />
          <ReturnCard
            title="Pós-procedimento sem retorno"
            description="EZT ou biópsia realizada há mais de 3 meses sem consulta de acompanhamento."
            count="7 PACIENTES  ·  2,8% DAS CADASTRADAS"
            names={["Rita Almeida", "Joana Vilela"]}
            days={["129 d", "112 d"]}
          />
        </ScrollView>
        <BottomNav />
      </ThemedView>
    </SafeAreaView>
  );
}

function ReturnCard({
  title,
  description,
  count,
  names,
  days,
}: {
  title: string;
  description: string;
  count: string;
  names: string[];
  days: string[];
}) {
  return (
    <ThemedView style={styles.returnCard} borderColor="border">
      <View style={styles.returnHeader}>
        <ThemedView type="secondary" style={styles.line} />
        <ThemedText style={styles.returnTitle}>{title}</ThemedText>
      </View>
      <ThemedText style={styles.description} themeColor="textSecondary">
        {description}
      </ThemedText>
      <ThemedText type="code" themeColor="textSecondary" style={styles.count}>
        {count}
      </ThemedText>
      {names.map((name, index) => (
        <ThemedView
          key={name}
          style={styles.patientRow}
          borderTopColor="border"
        >
          <View>
            <ThemedText>{name}</ThemedText>
            <ThemedText type="code" themeColor="muted">
              PRT 10482
            </ThemedText>
          </View>
          <ThemedText themeColor="secondary" style={styles.days}>
            {days[index]} ›
          </ThemedText>
        </ThemedView>
      ))}
      {names.length > 0 && (
        <Pressable style={styles.more}>
          <ThemedText themeColor="primary">
            VER TODAS ·{" "}
            {names.length === 2 ? (count.startsWith("12") ? "12" : "7") : ""}
          </ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  content: { paddingHorizontal: 21, paddingBottom: 130, gap: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 4,
    paddingBottom: 12,
  },
  date: {
    letterSpacing: Typography.letterSpacing.expanded,
    fontSize: Typography.sizes.micro,
  },
  greeting: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.greeting,
    lineHeight: Typography.lineHeights.greeting,
    marginTop: 6,
  },
  crm: {
    fontSize: Typography.sizes.micro,
    letterSpacing: Typography.letterSpacing.normal,
    marginTop: 3,
  },
  exit: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderColor: Theme.border,
  },
  exitText: { fontSize: Typography.sizes.micro },
  totalCard: { borderWidth: 1, borderRadius: 17, padding: 18, gap: 8 },
  cardLabel: { flexDirection: "row", alignItems: "center", gap: 9 },
  line: { width: 18, height: 3 },
  cardLabelText: {
    fontSize: Typography.sizes.micro,
    fontWeight: Typography.weights.semibold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  total: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.metric,
    lineHeight: Typography.lineHeights.metric,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  returnCard: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  returnHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 16,
    paddingTop: 15,
  },
  returnTitle: { fontWeight: Typography.weights.semibold },
  description: {
    fontSize: Typography.sizes.small,
    lineHeight: Typography.lineHeights.compact,
    paddingHorizontal: 16,
    paddingTop: 7,
  },
  count: {
    fontSize: Typography.sizes.tiny,
    letterSpacing: Typography.letterSpacing.normal,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  patientRow: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  days: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.bodySmall,
  },
  more: {
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 35,
    margin: 12,
    borderColor: Theme.primary,
  },
});
