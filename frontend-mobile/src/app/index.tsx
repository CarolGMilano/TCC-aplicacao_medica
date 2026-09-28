import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Field } from "@/components/field";
import { login } from "@/constants/api";
import { Fonts } from "@/constants/theme";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

export default function HomeScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError("Informe seu e-mail e sua senha.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace("/dashboard");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível entrar agora.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <View style={[styles.progress, { backgroundColor: theme.alert }]} />
        <View
          style={[styles.progressAccent, { backgroundColor: theme.warning }]}
        />

        <View style={styles.heading}>
          <ThemedText style={[styles.logo, { color: theme.text }]}>
            CerviCare
          </ThemedText>
          <ThemedText
            type="code"
            themeColor="textSecondary"
            style={styles.tagline}
          >
            SAÚDE DA MULHER · RASTREIO E TRATAMENTO
          </ThemedText>
        </View>

        <View style={styles.form}>
          <Field
            label="E-MAIL"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="seu.email@exemplo.com"
          />
          <Field
            label="SENHA"
            value={password}
            onChangeText={setPassword}
            password
            autoComplete="password"
            placeholder="••••••••"
            error={error}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/forgot-password")}
            style={styles.forgot}
          >
            <ThemedText
              type="code"
              themeColor="primary"
              style={styles.forgotText}
            >
              ESQUECI A SENHA
            </ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.submit,
              { backgroundColor: theme.accent },
              pressed && styles.pressed,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText style={styles.submitText}>Entrar</ThemedText>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 25, paddingTop: 72 },
  progress: { height: 5, width: "66%", borderRadius: 8 },
  progressAccent: {
    position: "absolute",
    top: 72,
    left: "66%",
    right: 25,
    height: 5,
    borderRadius: 8,
  },
  heading: { marginTop: 32, gap: 14 },
  logo: { fontFamily: Fonts.serif, fontSize: 38, lineHeight: 44 },
  tagline: { fontSize: 9, letterSpacing: 1.7 },
  form: { marginTop: 56, gap: 24 },
  forgot: { alignSelf: "center", marginTop: -4 },
  forgotText: { fontSize: 9, letterSpacing: 0.7 },
  submit: {
    minHeight: 51,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  submitText: { color: "#ffffff", fontWeight: "700" },
  pressed: { opacity: 0.8 },
});
