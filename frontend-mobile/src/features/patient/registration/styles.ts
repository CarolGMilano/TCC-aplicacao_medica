import { StyleSheet } from "react-native";

import {
  FontFamilies,
  Spacing,
  Theme,
  Typography,
} from "@/constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  screen: {
    flex: 1,
  },

  content: {
    paddingBottom: 100,
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

  dateRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },

  review: {
    backgroundColor: Theme.background,
    marginTop: Spacing.three,
  },

  error: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },

  continue: {
    position: "absolute",
    bottom: 16,
    left: Spacing.three,
    right: Spacing.three,
    minHeight: 54,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.primary,
  },

  continueText: {
    fontWeight: Typography.weights.bold,
  },

  pressed: {
    opacity: 0.8,
  },
});