import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav, useBottomNavHeight } from "@/components/shared/bottom-nav";
import { inputStyles } from "@/components/shared/input-styles";
import { PillButton } from "@/components/shared/pill-button";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";
import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
import { statusOptions } from "@/features/patient/registration/constants";

import { PatientListItem } from "./components/patient-list-item";
import { StatusFilter } from "./components/status-filter";
import { usePatientList } from "./use-patient-list";

const filterOptions = ["Todas", ...statusOptions];

export function PatientList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todas");
  const [filterOpen, setFilterOpen] = useState(false);
  const bottomNavHeight = useBottomNavHeight();
  const {
    patients,
    filteredPatients,
    total,
    unitTotal,
    error,
    isLoading,
    isRefreshing,
  } = usePatientList(status, search);
  const unitCount = isLoading ? "—" : (unitTotal ?? (total || patients.length));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.headerTop}>
            <PillButton
              label="Dashboard"
              accessibilityLabel="Voltar para o Dashboard"
              onPress={() => router.dismissTo("/dashboard")}
            />
            <ActivityIndicator
              animating={isRefreshing && filteredPatients.length > 0}
              color={Theme.primary}
            />
          </View>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>Pacientes</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {unitCount} na unidade
            </ThemedText>
          </View>
          <View style={styles.searchBox}>
            <SymbolView
              name={{
                ios: "magnifyingglass",
                android: "search",
                web: "search",
              }}
              tintColor={Theme.textSecondary}
              size={18}
            />
            <TextInput
              accessibilityLabel="Pesquisar pacientes"
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por nome ou prontuário"
              placeholderTextColor={Theme.placeholder}
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>
          <View style={styles.filterRow}>
            <ThemedText type="code" themeColor="textSecondary">
              Status
            </ThemedText>
            <StatusFilter
              value={status}
              options={filterOptions}
              open={filterOpen}
              onOpen={() => setFilterOpen(true)}
              onClose={() => setFilterOpen(false)}
              onChange={setStatus}
            />
          </View>
        </View>

        <View style={styles.listContainer}>
          {isLoading ? (
            <ActivityIndicator
              accessibilityLabel="Carregando pacientes"
              color={Theme.primary}
              style={styles.centered}
            />
          ) : error ? (
            <View style={styles.centered}>
              <ThemedText themeColor="error" style={styles.centeredText}>
                {error}
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={filteredPatients}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <PatientListItem patient={item} />}
              ListEmptyComponent={
                <View style={styles.centered}>
                  {isRefreshing ? (
                    <ActivityIndicator
                      accessibilityLabel="Carregando pacientes"
                      color={Theme.primary}
                    />
                  ) : (
                    <ThemedText>Nenhuma paciente encontrada.</ThemedText>
                  )}
                </View>
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                filteredPatients.length === 0 && styles.emptyList,
                { paddingBottom: bottomNavHeight + Spacing.three },
              ]}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
        <BottomNav />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.heading,
    lineHeight: Typography.lineHeights.title,
  },

  // Mesmo visual dos outros campos.
  searchBox: {
    ...inputStyles.box,
    minHeight: 48,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },

  searchInput: {
    flex: 1,
    color: Theme.text,
    fontFamily: FontFamilies.primary,
    fontSize: Typography.sizes.input,
    paddingVertical: 0,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },

  listContainer: {
    flex: 1,
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },

  centeredText: { textAlign: "center" },

  emptyList: { flexGrow: 1 },
});
