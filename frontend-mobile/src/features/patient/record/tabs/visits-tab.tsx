import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { FontFamilies, Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import { EmptyState, VisitItem } from "../components";
import { visitFilters } from "../constants";
import { fetchVisits } from "../services/visits-api";
import type { VisitLists, VisitType } from "../types";

// Tela de cada tipo de registro, que abre o registro salvo com recordId.
const visitRoutes = {
  consultations: "/patients/[id]/consultation",
  cytology: "/patients/[id]/cytology",
  pcr: "/patients/[id]/pcr",
  colposcopy: "/patients/[id]/colposcopy",
  procedures: "/patients/[id]/procedure",
} as const;

// Só aceita um filtro conhecido; outro texto quebraria visits[filter].
function isVisitType(value: string | undefined): value is VisitType {
  return visitFilters.some((item) => item.id === value);
}

type VisitsTabProps = {
  patientId: number;
  patientName: string;
  patientRecord: string;
};

export function VisitsTab({
  patientId,
  patientName,
  patientRecord,
}: VisitsTabProps) {
  const [visits, setVisits] = useState<VisitLists | null>(null);
  const [error, setError] = useState("");
  // Ao voltar de um novo registro, a ficha recebe o tipo salvo em "filter"
  // e um "saved" diferente a cada salvamento.
  const params = useLocalSearchParams<{ filter?: string; saved?: string }>();
  // Tipo filtrado. Ao voltar de um registro salvo, mostra o tipo salvo.
  const [filter, setFilter] = useState<VisitType>(
    isVisitType(params.filter) ? params.filter : "consultations",
  );

  // A ficha já está aberta quando o parâmetro chega: ajusta durante a
  // renderização, como recomenda o React para estado derivado de props.
  const [handledSave, setHandledSave] = useState(params.saved);
  if (params.saved !== handledSave) {
    setHandledSave(params.saved);
    const saved = params.filter;
    if (params.saved && isVisitType(saved)) setFilter(saved);
  }

  // Limpa os parâmetros depois de usá-los, para a aba não reabrir a seção
  // quando for montada de novo.
  useEffect(() => {
    if (params.saved) router.setParams({ filter: undefined, saved: undefined });
  }, [params.saved]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setError("");

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
    }, [patientId]),
  );

  if (error) return <EmptyState title={error} />;

  if (!visits) {
    return <ActivityIndicator style={styles.loading} color={Theme.primary} />;
  }

  // Sem nenhum atendimento, só o aviso; o "+ Novo registro" fica no rodapé.
  if (Object.values(visits).every((list) => list.length === 0)) {
    return (
      <EmptyState
        title="Nenhum atendimento ainda"
        note="Lance a primeira colposcopia, exame, procedimento ou consulta desta paciente."
      />
    );
  }

  const list = visits[filter];

  // Filtro por tipo, como na especificação, e a lista do tipo escolhido.
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filters}
      >
        {visitFilters.map((item) => {
          const active = item.id === filter;
          const alert = visits[item.id].some((visit) => visit.highlight);
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${item.label}: ${countLabel(visits[item.id].length)}`}
              onPress={() => setFilter(item.id)}
              style={[styles.filter, active && styles.filterActive]}
            >
              <ThemedText
                type="small"
                style={styles.filterText}
                themeColor={
                  active ? "textPrimaryLight" : alert ? "error" : "text"
                }
              >
                {item.label} · {visits[item.id].length}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.list}>
        {list.length === 0 ? (
          <ThemedText themeColor="textSecondary" style={styles.empty}>
            Nenhum registro deste tipo.
          </ThemedText>
        ) : (
          list.map((visit) => (
            <VisitItem
              key={visit.id}
              visit={visit}
              onPress={() =>
                router.push({
                  pathname: visitRoutes[filter],
                  params: {
                    id: String(patientId),
                    name: patientName,
                    record: patientRecord,
                    recordId: String(visit.id),
                  },
                })
              }
            />
          ))
        )}
      </View>
    </View>
  );
}

function countLabel(count: number) {
  if (count === 0) return "Nenhum registro";
  return count === 1 ? "1 registro" : `${count} registros`;
}

const styles = StyleSheet.create({
  loading: {
    paddingVertical: Spacing.five,
  },

  container: {
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },

  filtersScroll: { flexGrow: 0 },

  filters: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },

  filter: {
    minHeight: 40,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: Theme.inputBackground,
  },

  filterActive: { backgroundColor: Theme.primary },

  filterText: { fontFamily: FontFamilies.primaryMedium },

  list: {
    marginHorizontal: Spacing.three,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: Theme.backgroundElement,
  },

  empty: { padding: Spacing.three },
});
