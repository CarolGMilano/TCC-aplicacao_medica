import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";

import { Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import { styles as registrationStyles } from "../../registration/styles";
import { priorityColors, recordTabs, statusColors } from "../constants";
import type { PatientRecord, RecordTab } from "../types";
import { formatBirthDate } from "../utils";
import { Badge } from "./badge";

type RecordHeaderProps = {
  record: PatientRecord;
  tab: RecordTab;
  created: boolean;
  editing: boolean;
  onBack: () => void;
  onTabChange: (tab: RecordTab) => void;
};

export function RecordHeader({
  record,
  tab,
  created,
  editing,
  onBack,
  onTabChange,
}: RecordHeaderProps) {
  const { form } = record;
  const status = statusColors[form.status];
  const priority = record.priorityGroup
    ? priorityColors.inside
    : priorityColors.outside;

  return (
    <View style={registrationStyles.header}>
      <View style={registrationStyles.headerTop}>
        <Pressable onPress={onBack} accessibilityRole="button" hitSlop={8}>
          <View style={styles.backButton}>
            <SymbolView
              name={{
                ios: "arrow.left",
                android: "arrow_back",
                web: "arrow_back",
              }}
              tintColor={Theme.textSecondary}
              size={19}
            />
            <ThemedText type="code" themeColor="textSecondary">
              PACIENTES
            </ThemedText>
          </View>
        </Pressable>
        {editing || created ? (
          <Badge
            label={editing ? "Editando" : "Cadastrada"}
            color={Theme.textPrimaryLight}
            background={Theme.primary}
          />
        ) : null}
      </View>

      <View style={styles.identity}>
        <ThemedText style={registrationStyles.title}>{form.name}</ThemedText>
        <ThemedText type="code" themeColor="textSecondary">
          {record.age} ANOS · {formatBirthDate(record)} · PRT {form.record}
        </ThemedText>
      </View>

      <View style={styles.badges}>
        <Badge
          label={
            record.priorityGroup
              ? "Grupo prioritário"
              : "Fora do grupo prioritário"
          }
          color={priority.text}
          background={priority.background}
        />
        {status ? (
          <Badge
            label={form.status}
            color={status.text}
            background={status.background}
          />
        ) : null}
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {recordTabs.map((item) => {
          const active = item.id === tab;

          return (
            <Pressable
              key={item.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => onTabChange(item.id)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <ThemedText
                type="small"
                numberOfLines={1}
                style={styles.tabLabel}
                themeColor={active ? "text" : "textSecondary"}
              >
                {item.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },

  identity: {
    gap: Spacing.one,
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: Spacing.two,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginBottom: -1,
  },

  // Menor que o corpo para os seis rótulos caberem sem cortar.
  tabLabel: {
    fontSize: Typography.sizes.notice,
  },

  tabActive: {
    borderBottomColor: Theme.text,
  },
});
