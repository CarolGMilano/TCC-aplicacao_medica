import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Field } from "@/components/shared/field";
import { PillButton } from "@/components/shared/pill-button";
import { FontFamilies, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { useTheme } from "@/hooks/use-theme";

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <PillButton
          label="Voltar"
          icon="back"
          onPress={() => router.back()}
        />

        <View style={styles.heading}>
          <ThemedText style={styles.title}>Esqueci a senha</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Informe seu e-mail para solicitar ajuda ao administrador da unidade.
          </ThemedText>
        </View>

        <Field
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="seu.email@exemplo.com"
        />
        <Pressable
          onPress={() => setSubmitted(true)}
          style={[styles.submit, { backgroundColor: theme.accent }]}
        >
          <ThemedText type="button" themeColor="textPrimaryLight">
            Solicitar ajuda
          </ThemedText>
        </Pressable>
        {submitted && (
          <ThemedText type="small" themeColor="textSecondary">
            A solicitação foi registrada neste dispositivo. A redefinição por
            e-mail será habilitada quando o endpoint de recuperação estiver
            disponível no backend.
          </ThemedText>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 25, paddingTop: 28, gap: 28 },
  heading: { marginTop: 34, gap: 12 },
  title: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.title,
    lineHeight: Typography.lineHeights.title,
  },
  submit: {
    minHeight: 51,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
