import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/shared/bottom-nav";
import { Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { useTheme } from "@/hooks/use-theme";

export default function PatientsScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <ThemedText type="code" themeColor="textSecondary">
          PACIENTES
        </ThemedText>
        <ThemedText style={styles.title}>Pacientes</ThemedText>
        <ThemedText themeColor="textSecondary">
          A lista completa e o CRUD de pacientes ficam disponíveis na versão
          web.
        </ThemedText>
        <Pressable
          onPress={() => router.push("/new-patient")}
          style={[styles.button, { backgroundColor: theme.accent }]}
        >
          <ThemedText themeColor="textPrimaryLight" style={styles.buttonText}>
            Cadastrar paciente
          </ThemedText>
        </Pressable>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, gap: 12 },
  title: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.semibold,
  },
  button: {
    minHeight: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: {
    fontWeight: Typography.weights.bold,
  },
});
