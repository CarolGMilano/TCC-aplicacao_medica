import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import { EmptyState, VisitItem } from "../components";
import { visitFilters } from "../constants";
import { fetchVisits } from "../services/visits-api";
import type { VisitLists, VisitType } from "../types";

type VisitsTabProps = {
  patientId: number;
};

export function VisitsTab({ patientId }: VisitsTabProps) {
  const [visits, setVisits] = useState<VisitLists | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<VisitType>("consultations");

  useEffect(() => {
    let active = true;

    fetchVisits(patientId)
      .then((lists) => {
        if (active) setVisits(lists);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar os atendimentos.",
        );
      });

    return () => {
      active = false;
    };
  }, [patientId]);

  if (error) return <EmptyState title={error} />;

  if (!visits) {
    return <ActivityIndicator style={styles.loading} color={Theme.primary} />;
  }

  // Sem nenhum atendimento, o layout mostra só o aviso, sem filtros.
  if (Object.values(visits).every((list) => list.length === 0)) {
    return (
      <EmptyState
        title="Nenhum atendimento ainda"
        note="Lance a primeira colposcopia, exame, procedimento ou consulta desta paciente."
      />
    );
  }

  const list = visits[filter];

  return (
    <View>
      <View style={styles.filters}>
        {visitFilters.map((item) => {
          const active = item.id === filter;

          return (
            <Pressable
              key={item.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
              onPress={() => setFilter(item.id)}
              style={[styles.filter, active && styles.filterActive]}
            >
              <ThemedText
                type="code"
                themeColor={active ? "textPrimaryLight" : "textSecondary"}
              >
                {item.label.toUpperCase()}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <ThemedText type="code" themeColor="textSecondary" style={styles.count}>
        {list.length ? `${list.length} REGISTRO(S)` : "SEM REGISTROS"}
      </ThemedText>

      {list.length ? (
        list.map((visit) => <VisitItem key={visit.id} visit={visit} />)
      ) : (
        <EmptyState title="Nenhum registro nesta aba" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingVertical: Spacing.five,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },

  filter: {
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 16,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },

  filterActive: {
    backgroundColor: Theme.primary,
    borderColor: Theme.primary,
  },

  count: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});
