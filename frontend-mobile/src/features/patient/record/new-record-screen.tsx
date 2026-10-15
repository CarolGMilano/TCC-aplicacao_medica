import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";

const recordTypes = [
  "Consulta",
  "Citologia",
  "PCR DNA HPV",
  "Colposcopia",
  "Procedimento",
];

export function NewRecordScreen() {
  const { id, name, record } = useLocalSearchParams<{
    id: string;
    name: string;
    record: string;
  }>();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ThemedView style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancelar e voltar para atendimentos"
            hitSlop={8}
            onPress={() => router.back()}
            style={styles.cancel}
          >
            <ThemedText style={styles.close}>×</ThemedText>
            <ThemedText type="code" themeColor="textSecondary">
              CANCELAR
            </ThemedText>
          </Pressable>
          <ThemedText style={styles.title}>Novo registro</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {name} · PRT {record}
          </ThemedText>
        </View>

        <View style={styles.options}>
          {recordTypes.map((type) => (
            <Pressable
              key={type}
              accessibilityRole="button"
              accessibilityLabel={`Criar registro de ${type}`}
              onPress={() => {
                if (type === "Consulta") {
                  router.push({
                    pathname: "/patients/[id]/consultation",
                    params: { id: String(id), name, record },
                  });
                } else if (type === "Citologia") {
                  router.push({
                    pathname: "/patients/[id]/cytology",
                    params: { id: String(id), name, record },
                  });
                }
              }}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText>{type}</ThemedText>
              <SymbolView
                name={{
                  ios: "chevron.right",
                  android: "chevron_right",
                  web: "chevron_right",
                }}
                tintColor={Theme.textSecondary}
                size={19}
              />
            </Pressable>
          ))}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },

  cancel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: Spacing.four,
  },

  close: {
    color: Theme.textSecondary,
    fontSize: 26,
    lineHeight: 20,
  },

  title: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.title,
    lineHeight: Typography.lineHeights.title,
    marginBottom: Spacing.one,
  },

  options: { backgroundColor: Theme.backgroundElement },
  option: {
    minHeight: 64,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pressed: { opacity: 0.7 },
});
