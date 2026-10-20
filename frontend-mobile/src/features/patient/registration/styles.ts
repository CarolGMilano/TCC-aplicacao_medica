import { StyleSheet } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.background,
  },

  screen: {
    flex: 1,
  },

  content: {
    paddingBottom: Spacing.three,
  },

  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progress: {
    flexDirection: "row",
    gap: Spacing.one,
  },

  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 4,
  },

  title: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.title,
    lineHeight: Typography.lineHeights.title,
  },

  review: {
    backgroundColor: Theme.backgroundElement,
    marginTop: Spacing.three,
  },

  // Rodapé no fluxo, abaixo da lista: com o teclado aberto, o campo focado
  // não fica atrás do botão.
  footer: {
    padding: Spacing.three,
    gap: Spacing.two,
  },

  error: {
    backgroundColor: Theme.treatmentLight,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },

  continue: {
    minHeight: 54,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.primary,
  },

  pressed: {
    backgroundColor: Theme.primaryHoverDark,
  },

  disabled: {
    opacity: 0.6,
  },
});
