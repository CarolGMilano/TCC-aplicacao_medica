import type { ComponentProps, ReactNode } from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { FontFamilies, Spacing, Typography } from "@/constants/theme";
import { PillButton } from "@/components/shared/pill-button";
import { ThemedText } from "@/components/shared/themed-text";

type ScreenHeaderProps = {
  title: string;
  // Voltar/cancelar no topo, à esquerda.
  back?: ComponentProps<typeof PillButton>;
  // Algo no topo, à direita (etapa do cadastro, indicador de carregamento).
  topRight?: ReactNode;
  // Selo ao lado do título ("Editando").
  chip?: ReactNode;
  // Conteúdo abaixo do título (paciente, barra de passos, subtítulo).
  children?: ReactNode;
  // Título menor nas telas de lista.
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Cabeçalho comum das telas: ação de voltar, título e selo na mesma ordem e
// espaçamento em todo o app.
export function ScreenHeader({
  title,
  back,
  topRight,
  chip,
  children,
  compact,
  style,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      {back || topRight ? (
        <View style={styles.top}>
          {back ? <PillButton {...back} /> : <View />}
          {topRight}
        </View>
      ) : null}
      <View style={styles.titleRow}>
        <ThemedText style={[styles.title, compact && styles.titleCompact]}>
          {title}
        </ThemedText>
        {chip}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.three },

  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },

  // Títulos longos ("Novo PCR DNA HPV") quebram linha em vez de encostar no
  // selo.
  title: {
    flexShrink: 1,
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.title,
    lineHeight: Typography.lineHeights.title,
  },

  titleCompact: {
    fontSize: Typography.sizes.heading,
    lineHeight: Typography.lineHeights.title,
  },
});
