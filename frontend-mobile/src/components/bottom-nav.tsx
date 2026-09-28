import { router, usePathname } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Fonts } from "@/constants/theme";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

export function BottomNav() {
  const theme = useTheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isPatients = pathname.includes("patients");

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View
        style={[
          styles.pill,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}
      >
        <NavItem
          active={!isPatients}
          label="Dashboard"
          icon="house.fill"
          onPress={() => router.replace("/dashboard")}
        />
        <NavItem
          active={isPatients}
          label="Pacientes"
          icon="person.2"
          onPress={() => router.push("/patients")}
        />
      </View>
      <Pressable
        accessibilityLabel="Cadastrar novo paciente"
        accessibilityRole="button"
        onPress={() => router.push("/new-patient")}
        style={({ pressed }) => [
          styles.add,
          { backgroundColor: theme.accent },
          pressed && styles.pressed,
        ]}
      >
        <SymbolView name="person.badge.plus" tintColor="#ffffff" size={22} />
      </Pressable>
    </View>
  );
}

function NavItem({
  active,
  label,
  icon,
  onPress,
}: {
  active: boolean;
  label: string;
  icon: "house.fill" | "person.2";
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.item}
    >
      <SymbolView
        name={icon}
        tintColor={active ? theme.primary : theme.muted}
        size={19}
      />
      <ThemedText
        style={[
          styles.itemLabel,
          { color: active ? theme.primary : theme.textSecondary },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 22,
  },
  pill: {
    flex: 1,
    height: 58,
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    elevation: 3,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    minWidth: 92,
  },
  itemLabel: { fontFamily: Fonts.sans, fontSize: 11 },
  add: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  pressed: { opacity: 0.78 },
});
