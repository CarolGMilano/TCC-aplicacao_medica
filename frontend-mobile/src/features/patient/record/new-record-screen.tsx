import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PillButton } from "@/components/shared/pill-button";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";

const recordTypes = [
  { label: "Consulta", pathname: "/patients/[id]/consultation" },
  { label: "Citologia", pathname: "/patients/[id]/cytology" },
  { label: "PCR DNA HPV", pathname: "/patients/[id]/pcr" },
  { label: "Colposcopia", pathname: "/patients/[id]/colposcopy" },
  { label: "Procedimento", pathname: "/patients/[id]/procedure" },
] as const;

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
          <PillButton
            label="Cancelar"
            icon="close"
            accessibilityLabel="Cancelar e voltar para atendimentos"
            onPress={() => router.back()}
            style={styles.cancel}
          />
          <ThemedText style={styles.title}>Novo registro</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {name} · PRT {record}
          </ThemedText>
        </View>

        <View style={styles.options}>
          {recordTypes.map(({ label, pathname }) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityLabel={`Criar registro de ${label}`}
              onPress={() =>
                router.push({
                  pathname,
                  params: { id: String(id), name, record },
                })
              }
              style={({ pressed }) => [
                styles.option,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText>{label}</ThemedText>
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

  cancel: { marginBottom: Spacing.four },

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
