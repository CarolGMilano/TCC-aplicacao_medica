import { Pressable, StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { PillButton } from "@/components/shared/pill-button";
import { ThemedText } from "@/components/shared/themed-text";

import { styles as registrationStyles } from "../../registration/styles";
import { priorityColors, recordTabs, statusColors } from "../constants";
import type { PatientRecord, RecordTab } from "../types";
import { formatBirthDate } from "../utils";
import { Chip } from "@/components/shared/chip";

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
      <View style={[registrationStyles.headerTop, styles.headerTop]}>
        <PillButton label="Pacientes" onPress={onBack} />
        {editing || created ? (
          <Chip
            label={editing ? "Editando" : "Cadastrada"}
            color={Theme.textPrimaryLight}
            background={Theme.primary}
            large
          />
        ) : null}
      </View>

      <View style={styles.identity}>
        <ThemedText style={registrationStyles.title}>{form.name}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          {record.age} anos · {formatBirthDate(record)} · PRT {form.record}
        </ThemedText>
      </View>

      <View style={styles.badges}>
        <Chip
          label={
            record.priorityGroup
              ? "Grupo prioritário"
              : "Fora do grupo prioritário"
          }
          color={priority.text}
          background={priority.background}
        />
        {status ? (
          <Chip
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
                style={[styles.tabLabel, active && styles.tabLabelActive]}
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
  subtitle: {
    fontSize: Typography.sizes.action,
    lineHeight: Typography.lineHeights.input,
  },

  headerTop: {
    alignItems: "center",
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

  // Largura pelo rótulo (não seis partes iguais): "Pessoais" cabe em 360dp.
  tab: {
    flexGrow: 1,
    flexShrink: 1,
    alignItems: "center",
    paddingBottom: Spacing.two,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginBottom: -1,
  },

  // Menor que o corpo para os seis rótulos caberem sem cortar.
  tabLabel: {
    fontFamily: FontFamilies.primaryMedium,
    fontSize: Typography.sizes.notice,
  },

  tabLabelActive: {
    fontFamily: FontFamilies.primarySemiBold,
  },

  tabActive: {
    borderBottomColor: Theme.text,
  },
});
