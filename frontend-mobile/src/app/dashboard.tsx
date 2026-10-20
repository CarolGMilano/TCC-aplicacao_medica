import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/shared/bottom-nav";
import { PillButton } from "@/components/shared/pill-button";
import { ThemedView } from "@/components/shared/themed-view";
import { logout } from "@/features/auth/auth-session";
import { router } from "expo-router";
import { ThemedText } from "@/components/shared/themed-text";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";

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

          <ThemedView
            style={styles.totalCard}
            type="backgroundElement"
            borderColor="border"
          >
            <View style={styles.cardLabel}>
              <ThemedView type="tertiary" style={styles.line} />
              <ThemedText type="smallBold" themeColor="textSecondary">
                Pacientes cadastradas
              </ThemedText>
            </View>
            <ThemedText style={styles.total}>248</ThemedText>
            <View style={styles.cardFooter}>
              <ThemedText type="small" themeColor="textSecondary">
                Total na unidade
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ver lista de pacientes"
                onPress={() => router.push("/patients")}
                style={({ pressed }) => [
                  styles.listLink,
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText style={styles.linkText}>Ver lista</ThemedText>
                <SymbolView
                  name={{
                    ios: "arrow.right",
                    android: "arrow_forward",
                    web: "arrow_forward",
                  }}
                  tintColor={Theme.primary}
                  size={16}
                />
              </Pressable>
            </View>
          </ThemedView>

          <ReturnCard
            title="Ver e tratar sem retorno"
            description="Indicação de ver e tratar há mais de 2 meses sem nova consulta registrada."
            count="12 pacientes · 4,8% das cadastradas"
            names={["Cláudia Nunes", "Marina Souza"]}
            days={["146 d", "134 d"]}
            route="/dashboard/without-return"
          />
          <ReturnCard
            title="Pós-procedimento sem retorno"
            description="EZT ou biópsia realizada há mais de 3 meses sem consulta de acompanhamento."
            count="7 pacientes · 2,8% das cadastradas"
            names={["Rita Almeida", "Joana Vilela"]}
            days={["129 d", "112 d"]}
            route="/dashboard/post-procedure"
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
  route,
}: {
  title: string;
  description: string;
  count: string;
  names: string[];
  days: string[];
  route: "/dashboard/without-return" | "/dashboard/post-procedure";
}) {
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
      <ThemedText type="small" themeColor="textSecondary" style={styles.count}>
        {count}
      </ThemedText>
      {names.map((name, index) => (
        <ThemedView
          type="backgroundElement"
          key={name}
          style={styles.patientRow}
          borderTopColor="border"
        >
          <View>
            <ThemedText style={styles.name}>{name}</ThemedText>
            <ThemedText type="small" themeColor="muted">
              PRT 10482
            </ThemedText>
          </View>
          <View style={styles.daysRow}>
            <ThemedText themeColor="error" style={styles.days}>
              {days[index]}
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
        </ThemedView>
      ))}
      {names.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver todas: ${title}`}
          onPress={() => router.push(route)}
          style={({ pressed }) => [styles.more, pressed && styles.pressed]}
        >
          <ThemedText style={styles.linkText}>
            Ver todas ·{" "}
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

  totalCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.two,
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

  total: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.metric,
    lineHeight: Typography.lineHeights.metric,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },

  listLink: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
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
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

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
