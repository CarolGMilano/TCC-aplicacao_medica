import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

export default function NewPatientScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <ThemedText type="code" themeColor="textSecondary">
          NOVO PACIENTE
        </ThemedText>
        <ThemedText style={styles.title}>Cadastro de paciente</ThemedText>
        <ThemedText themeColor="textSecondary">
          A próxima etapa do app será construída aqui, mantendo o cadastro
          separado do CRUD da web.
        </ThemedText>
        <Pressable
          onPress={() => router.back()}
          style={[styles.button, { borderColor: theme.border }]}
        >
          <ThemedText themeColor="primary">Voltar</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, gap: 12 },
  title: { fontSize: 30, fontWeight: "600" },
  button: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
});
