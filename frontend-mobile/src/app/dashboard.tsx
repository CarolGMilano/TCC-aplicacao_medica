import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/bottom-nav";
import { logout } from "@/constants/auth-session";
import { router } from "expo-router";
import { Fonts } from "@/constants/theme";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

export default function DashboardScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <ThemedText
              type="code"
              themeColor="textSecondary"
              style={styles.date}
            >
              QUI, 04 SET
            </ThemedText>
            <ThemedText style={styles.greeting}>Ana Ribeiro</ThemedText>
            <ThemedText type="code" themeColor="muted" style={styles.crm}>
              CRM 118 402
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              logout();
              router.replace("/");
            }}
            style={[styles.exit, { borderColor: theme.border }]}
          >
            <ThemedText
              type="code"
              themeColor="textSecondary"
              style={styles.exitText}
            >
              SAIR
            </ThemedText>
          </Pressable>
        </View>

        <View
          style={[
            styles.totalCard,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.cardLabel}>
            <View style={[styles.line, { backgroundColor: theme.warning }]} />
            <ThemedText
              type="code"
              themeColor="textSecondary"
              style={styles.cardLabelText}
            >
              PACIENTES CADASTRADAS
            </ThemedText>
          </View>
          <ThemedText style={styles.total}>248</ThemedText>
          <View style={styles.cardFooter}>
            <ThemedText type="small" themeColor="textSecondary">
              Total na unidade
            </ThemedText>
            <ThemedText type="code" themeColor="primary">
              VER LISTA →
            </ThemedText>
          </View>
        </View>

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
  const theme = useTheme();
  return (
    <View
      style={[
        styles.returnCard,
        {
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.returnHeader}>
        <View
          style={[
            styles.line,
            {
              backgroundColor: theme.warning,
            },
          ]}
        />
        <ThemedText style={styles.returnTitle}>{title}</ThemedText>
      </View>
      <ThemedText style={styles.description} themeColor="textSecondary">
        {description}
      </ThemedText>
      <ThemedText type="code" themeColor="textSecondary" style={styles.count}>
        {count}
      </ThemedText>
      {names.map((name, index) => (
        <View
          key={name}
          style={[styles.patientRow, { borderTopColor: theme.border }]}
        >
          <View>
            <ThemedText>{name}</ThemedText>
            <ThemedText type="code" themeColor="muted">
              PRT 10482
            </ThemedText>
          </View>
          <ThemedText style={[styles.days, { color: theme.alert }]}>
            {days[index]} ›
          </ThemedText>
        </View>
      ))}
      {names.length > 0 && (
        <Pressable style={[styles.more, { borderColor: theme.primary }]}>
          <ThemedText type="code" style={{ color: theme.primary }}>
            VER TODAS ·{" "}
            {names.length === 2 ? (count.startsWith("12") ? "12" : "7") : ""}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

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

  date: {
    letterSpacing: 1.5,
    fontSize: 9,
  },

  greeting: {
    fontFamily: Fonts.serif,
    fontSize: 25,
    lineHeight: 30,
    marginTop: 6,
  },

  crm: {
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 3,
  },

  exit: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  exitText: { fontSize: 9 },

  totalCard: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 18,
    gap: 8,
  },

  cardLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  line: {
    width: 18,
    height: 3,
  },

  cardLabelText: {
    fontSize: 9,
    letterSpacing: 1.3,
  },

  total: {
    fontFamily: Fonts.serif,
    fontSize: 43,
    lineHeight: 48,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },

  returnCard: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },

  returnHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 16,
    paddingTop: 15,
  },

  returnTitle: { fontWeight: "600" },

  description: {
    fontSize: 12,
    lineHeight: 17,
    paddingHorizontal: 16,
    paddingTop: 7,
  },

  count: {
    fontSize: 8,
    letterSpacing: 1,
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
    fontFamily: Fonts.serif,
    fontSize: 14,
  },

  more: {
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 35,
    margin: 12,
  },
});
