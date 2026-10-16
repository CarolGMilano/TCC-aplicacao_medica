import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/shared/bottom-nav";
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
  const { patients, filteredPatients, total, error, isLoading } = usePatientList(
    status,
    search,
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.headerTop}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar para o Dashboard"
              hitSlop={8}
              onPress={() => router.replace("/dashboard")}
              style={styles.backButton}
            >
              <SymbolView
                name={{
                  ios: "arrow.left",
                  android: "arrow_back",
                  web: "arrow_back",
                }}
                tintColor={Theme.textSecondary}
                size={19}
              />
              <ThemedText type="code" themeColor="textSecondary">
                DASHBOARD
              </ThemedText>
            </Pressable>
          </View>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>Pacientes</ThemedText>
            <ThemedText type="code" themeColor="textSecondary">
              {isLoading ? "—" : total || patients.length} NA UNIDADE
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
              size={14}
            />
            <TextInput
              accessibilityLabel="Pesquisar pacientes"
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por nome ou prontuário"
              placeholderTextColor={Theme.textSecondary}
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>
          <View style={styles.filterRow}>
            <ThemedText type="code" themeColor="textSecondary">
              STATUS
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
                  <ThemedText>Nenhuma paciente encontrada.</ThemedText>
                </View>
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                filteredPatients.length === 0 ? styles.emptyList : undefined
              }
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },

  titleRow: {
    paddingTop: 1,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: FontFamilies.detail,
    fontSize: Typography.sizes.greeting,
    lineHeight: Typography.lineHeights.greeting,
  },

  searchBox: {
    height: 45,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 24,
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
    marginTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Theme.border,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },

  listContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Theme.border,
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
