import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";

type StepSectionProps = {
  title: string;
  children: ReactNode;
};

export function StepSection({ title, children }: StepSectionProps) {
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

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.three,
  },

  sectionTitle: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Theme.border,
  },
});
