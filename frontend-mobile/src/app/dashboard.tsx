import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav, useBottomNavHeight } from "@/components/shared/bottom-nav";
import { ThemedView } from "@/components/shared/themed-view";
import { Spacing } from "@/constants/theme";
import {
  DashboardHeader,
  type DashboardTab,
} from "@/features/dashboard/home/dashboard-header";
import { IndicatorsTab } from "@/features/dashboard/home/indicators-tab";
import { TodayTab } from "@/features/dashboard/home/today-tab";

// Cabeçalho e barra de baixo fixos; só o meio (a aba escolhida) rola.
export default function DashboardScreen() {
  const [tab, setTab] = useState<DashboardTab>("today");
  const bottomNavHeight = useBottomNavHeight();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.screen}>
        <DashboardHeader tab={tab} onChangeTab={setTab} />
        <ScrollView
          key={tab}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: bottomNavHeight + Spacing.five },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {tab === "today" ? <TodayTab /> : <IndicatorsTab />}
        </ScrollView>
        <BottomNav />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 21,
    paddingTop: Spacing.three,
  },
});
