import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  type TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Field } from "@/components/shared/field";
import { ThemedText } from "@/components/shared/themed-text";
import { FontFamilies, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { login } from "./services/auth-api";

const emailPattern = /^[^\s@]+@[^\s@]+$/;

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  async function handleLogin() {
    if (isSubmitting) return;

    setError("");
    setEmailError("");

    if (!email.trim() || !password.trim()) {
      setError("Informe seu e-mail e sua senha.");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      setEmailError("Informe um e-mail válido.");
      return;
    }

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
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.spacer} />
          <View style={styles.progressRow}>
            <View
              style={[styles.progress, { backgroundColor: theme.secondary }]}
            />
            <View
              style={[
                styles.progressAccent,
                { backgroundColor: theme.tertiary },
              ]}
            />
          </View>
          <View style={styles.heading}>
            <ThemedText style={styles.logo}>CerviCare</ThemedText>
            <ThemedText type="code" themeColor="textSecondary">
              Saúde da mulher · rastreio e tratamento
            </ThemedText>
          </View>
          <View style={styles.form}>
            <Field
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="seu.email@exemplo.com"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => passwordRef.current?.focus()}
              error={emailError}
            />
            <Field
              ref={passwordRef}
              label="Senha"
              value={password}
              onChangeText={setPassword}
              password
              autoComplete="password"
              placeholder="••••••••"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              error={error}
            />
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
                <ActivityIndicator color={theme.textPrimaryLight} />
              ) : (
                <ThemedText type="button" themeColor="textPrimaryLight">
                  Entrar
                </ThemedText>
              )}
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/forgot-password")}
              style={styles.forgot}
            >
              <ThemedText type="code" themeColor="textSecondary">
                Esqueci a senha
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  content: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 24,
  },

  // Até 160 de respiro no topo; encolhe em tela pequena ou com o teclado aberto.
  spacer: {
    flex: 1,
    maxHeight: 160,
  },

  progressRow: { flexDirection: "row" },

  progress: {
    height: 5,
    width: "66%",
    borderRadius: 8,
  },

  // Sobrepõe 25 ao fim da barra rosa, para as duas ficarem emendadas.
  progressAccent: {
    flex: 1,
    height: 5,
    borderRadius: 8,
    marginLeft: -25,
  },

  heading: {
    marginTop: 32,
    gap: 14,
  },

  logo: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.logo,
    lineHeight: Typography.lineHeights.logo,
  },

  form: {
    marginTop: 56,
    gap: 28,
  },

  forgot: {
    alignSelf: "center",
    marginTop: -4,
  },

  submit: {
    minHeight: 58,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  pressed: { opacity: 0.8 },
});
