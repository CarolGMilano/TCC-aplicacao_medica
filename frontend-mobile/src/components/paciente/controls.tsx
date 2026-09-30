import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";

import type { ReactNode } from "react";

export function StepSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <ThemedView type="backgroundSelected" style={styles.sectionTitle}>
        <ThemedText type="code" themeColor="textSecondary">
          {title}
        </ThemedText>
      </ThemedView>
      {children}
    </View>
  );
}

export function InputField({
  label,
  value,
  placeholder,
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.inputField}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor={Theme.muted}
        style={styles.textInput}
      />
    </View>
  );
}

export function Counter({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <View style={styles.row}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View style={styles.counter}>
        <RoundButton
          label="−"
          onPress={() => onChange(Math.max(0, value - 1))}
        />
        <ThemedText style={styles.counterValue}>{value}</ThemedText>
        <RoundButton label="+" active onPress={() => onChange(value + 1)} />
        {suffix ? (
          <ThemedText type="code" themeColor="textSecondary">
            {suffix}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

export function RoundButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.roundButton, active && styles.roundButtonActive]}
    >
      <ThemedText themeColor={active ? "textPrimaryLight" : "textSecondary"}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <ChoiceRow
      label={label}
      options={["Sim", "Não"]}
      selected={value ? "Sim" : "Não"}
      onSelect={(choice) => onChange(choice === "Sim")}
    />
  );
}

export function ChoiceRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.choiceRow}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View style={styles.choiceList}>
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[
              styles.choice,
              option === selected && styles.choiceSelected,
            ]}
          >
            <ThemedText
              themeColor={
                option === selected ? "textPrimaryLight" : "textSecondary"
              }
            >
              {option}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function OptionRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: () => void;
}) {
  return (
    <Pressable style={styles.optionRow} onPress={onChange}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText>{value}</ThemedText>
    </Pressable>
  );
}

export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <ThemedText type="code" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText>{value}</ThemedText>
    </View>
  );
}

export function ReviewBlock({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <View style={styles.reviewBlock}>
      <ThemedText type="code" themeColor="textSecondary">
        {title}
      </ThemedText>
      <ThemedText>{value}</ThemedText>
      <ThemedText>{detail}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: Spacing.three },
  sectionTitle: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Theme.border,
  },
  inputField: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: Spacing.two,
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.input,
    color: Theme.text,
  },
  row: {
    minHeight: 60,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  counter: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  counterValue: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.subtitle,
  },
  roundButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Theme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  roundButtonActive: {
    backgroundColor: Theme.primary,
    borderColor: Theme.primary,
  },
  choiceRow: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  choiceList: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.one },
  choice: {
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  choiceSelected: {
    backgroundColor: Theme.primary,
    borderColor: Theme.primary,
  },
  optionRow: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  summaryRow: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  reviewBlock: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.one,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
});
