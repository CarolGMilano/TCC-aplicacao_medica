import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { PillButton } from "@/components/shared/pill-button";
import { ThemedText } from "@/components/shared/themed-text";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { logout } from "@/features/auth/auth-session";

import { doctor } from "./mocks";

// Cabeçalho fixo: só a lista rola por baixo dele.
export function DashboardHeader() {
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
});
