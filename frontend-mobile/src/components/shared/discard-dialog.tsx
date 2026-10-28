import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";

type DialogAction = { label: string; onPress?: () => void };

type DialogRequest = {
  title: string;
  message: string;
  // Botão verde cheio (a ação principal) e, embaixo, o botão só de texto.
  primary: DialogAction;
  secondary: DialogAction & { danger?: boolean };
  // Tocar fora ou no voltar do Android.
  onDismiss?: () => void;
};

// Um diálogo só para o app: as telas chamam showDialog/confirmDiscard (como
// faziam com o Alert.alert) e o DiscardDialogHost, montado no layout, desenha.
let listener: ((request: DialogRequest | null) => void) | null = null;

export function showDialog(request: DialogRequest) {
  listener?.(request);
}

export function confirmDiscard({
  title = "Descartar alterações?",
  message = "As mudanças deste bloco ainda não foram salvas.",
  onDiscard,
}: {
  title?: string;
  message?: string;
  onDiscard: () => void;
}) {
  showDialog({
    title,
    message,
    primary: { label: "Continuar editando" },
    secondary: { label: "Descartar", danger: true, onPress: onDiscard },
  });
}

export function DiscardDialogHost() {
  const [request, setRequest] = useState<DialogRequest | null>(null);
  const current = useRef<DialogRequest | null>(null);

  useEffect(() => {
    // Um pedido novo por cima de outro fecha o anterior como "dispensado",
    // para quem espera a resposta (ex.: confirmBeforeSave) não ficar travado.
    listener = (next) => {
      current.current?.onDismiss?.();
      current.current = next;
      setRequest(next);
    };
    return () => {
      listener = null;
    };
  }, []);

  function run(action?: () => void) {
    current.current = null;
    setRequest(null);
    action?.();
  }

  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      visible={request !== null}
      onRequestClose={() => run(request?.onDismiss)}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ThemedText style={styles.title}>{request?.title}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.message}>
            {request?.message}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => run(request?.primary.onPress)}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          >
            <ThemedText style={styles.primaryText}>
              {request?.primary.label}
            </ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => run(request?.secondary.onPress)}
            style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
          >
            <ThemedText
              style={[
                styles.secondaryText,
                request?.secondary.danger && styles.danger,
              ]}
            >
              {request?.secondary.label}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(38, 48, 31, 0.45)",
    justifyContent: "center",
    padding: Spacing.four,
  },
  card: {
    backgroundColor: Theme.backgroundElement,
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.section,
    lineHeight: Typography.lineHeights.greeting,
  },
  message: { marginBottom: Spacing.three },
  primary: {
    minHeight: 50,
    borderRadius: 25,
    backgroundColor: Theme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: Theme.textPrimaryLight,
    fontFamily: FontFamilies.primarySemiBold,
  },
  secondary: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    color: Theme.textSecondary,
    fontFamily: FontFamilies.primarySemiBold,
  },
  danger: { color: Theme.error },
  pressed: { opacity: 0.7 },
});
