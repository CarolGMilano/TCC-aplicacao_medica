import { Children, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";

// Campos curtos lado a lado, em colunas de mesma largura. Um item nulo
// (campo condicional escondido) deixa a coluna vazia, sem esticar o outro.
export function FieldRow({ children }: { children: ReactNode }) {
  return (
    <View style={styles.row}>
      {Children.toArray(children).map((child, index) => (
        <View key={index} style={styles.cell}>
          {child}
        </View>
      ))}
      {Children.count(children) < 2 ? <View style={styles.cell} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.three,
  },

  cell: { flex: 1 },
});
