import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";

type DiscardRequest = {
  title?: string;
  message?: string;
  onDiscard: () => void;
};

// Um diálogo só para o app: as telas chamam confirmDiscard (como faziam com
// o Alert.alert) e o DiscardDialogHost, montado no layout, desenha o aviso.
let listener: ((request: DiscardRequest | null) => void) | null = null;

export function confirmDiscard(request: DiscardRequest) {
  listener?.(request);
}

export function DiscardDialogHost() {
  const [request, setRequest] = useState<DiscardRequest | null>(null);

  useEffect(() => {
    listener = setRequest;
    return () => {
      listener = null;
    };
  }, []);

  const close = () => setRequest(null);

  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      visible={request !== null}
      onRequestClose={close}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ThemedText style={styles.title}>
            {request?.title ?? "Descartar alterações?"}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.message}>
            {request?.message ??
              "As mudanças deste bloco ainda não foram salvas."}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={close}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          >
            <ThemedText style={styles.primaryText}>Continuar editando</ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              const onDiscard = request?.onDiscard;
              close();
              onDiscard?.();
            }}
            style={({ pressed }) => [styles.discard, pressed && styles.pressed]}
          >
            <ThemedText style={styles.discardText}>Descartar</ThemedText>
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
  discard: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  discardText: {
    color: Theme.error,
    fontFamily: FontFamilies.primarySemiBold,
  },
  pressed: { opacity: 0.7 },
});
