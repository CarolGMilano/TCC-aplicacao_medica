import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { FontFamilies, Spacing, Theme, Typography } from "@/constants/theme";
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
  // Seções abertas. Ao voltar de um registro salvo, a do tipo salvo abre.
  const [open, setOpen] = useState<VisitType[]>(
    isVisitType(params.filter) ? [params.filter] : [],
  );

  // A ficha já está aberta quando o parâmetro chega: ajusta durante a
  // renderização, como recomenda o React para estado derivado de props.
  const [handledSave, setHandledSave] = useState(params.saved);
  if (params.saved !== handledSave) {
    setHandledSave(params.saved);
    const saved = params.filter;
    if (params.saved && isVisitType(saved) && !open.includes(saved)) {
      setOpen([...open, saved]);
    }
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

  function toggle(type: VisitType) {
    setOpen((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  }

  // Uma seção fixa por tipo, na ordem do fluxo de atendimento. O cabeçalho
  // já mostra a quantidade e o último resultado; tocando, abre a lista.
  return (
    <View style={styles.sections}>
      {visitFilters.map((item) => {
        const list = visits[item.id];
        const latest = list[0];
        const expanded = open.includes(item.id) && list.length > 0;
        const alert = list.some((visit) => visit.highlight);

        return (
          <View key={item.id} style={styles.section}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{
                expanded,
                disabled: list.length === 0,
              }}
              accessibilityLabel={`${item.label}: ${countLabel(list.length)}`}
              disabled={list.length === 0}
              onPress={() => toggle(item.id)}
              style={({ pressed }) => [
                styles.sectionHeader,
                expanded && styles.sectionHeaderOpen,
                alert && styles.sectionAlert,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.sectionText}>
                <View style={styles.sectionTitleRow}>
                  <ThemedText
                    style={styles.sectionTitle}
                    themeColor={list.length ? "text" : "textSecondary"}
                  >
                    {item.label}
                  </ThemedText>
                  <View
                    style={[
                      styles.count,
                      list.length > 0 && styles.countFilled,
                      alert && styles.countAlert,
                    ]}
                  >
                    <ThemedText
                      type="small"
                      style={styles.countText}
                      themeColor={alert ? "error" : "textSecondary"}
                    >
                      {countLabel(list.length)}
                    </ThemedText>
                  </View>
                </View>
                {latest ? (
                  <ThemedText
                    type="small"
                    themeColor={latest.highlight ? "error" : "textSecondary"}
                    numberOfLines={1}
                  >
                    Último: {latest.title} · {latest.date}
                  </ThemedText>
                ) : null}
              </View>
              {/* Seta, e não "+", para não parecer "adicionar registro". */}
              {list.length ? (
                <SymbolView
                  name={{
                    ios: expanded ? "chevron.up" : "chevron.down",
                    android: expanded ? "expand_less" : "expand_more",
                    web: expanded ? "expand_less" : "expand_more",
                  }}
                  tintColor={Theme.textSecondary}
                  size={24}
                />
              ) : null}
            </Pressable>

            {expanded
              ? list.map((visit) => (
                  <VisitItem
                    key={visit.id}
                    visit={visit}
                    onPress={() =>
                      router.push({
                        pathname: visitRoutes[item.id],
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
              : null}
          </View>
        );
      })}
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

  // Cada tipo é um card: o cabeçalho em destaque e, aberto, os registros
  // logo abaixo, dentro do mesmo card.
  sections: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.two + Spacing.one,
  },

  section: {
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: Theme.backgroundElement,
  },

  // Borda sempre presente (transparente) para o texto não pular ao destacar.
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 72,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },

  sectionHeaderOpen: {
    backgroundColor: Theme.cardDetail,
  },

  sectionAlert: {
    borderLeftColor: Theme.secondary,
  },

  sectionText: {
    flex: 1,
    gap: Spacing.one,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },

  sectionTitle: {
    flexShrink: 1,
    fontFamily: FontFamilies.primarySemiBold,
    fontSize: Typography.sizes.section,
    lineHeight: Typography.lineHeights.body + 2,
  },

  count: {
    borderRadius: 12,
    paddingHorizontal: Spacing.two + Spacing.half,
    paddingVertical: Spacing.half,
  },

  countFilled: { backgroundColor: Theme.inputBackground },

  countAlert: { backgroundColor: Theme.administratorLight },

  countText: { fontFamily: FontFamilies.primaryMedium },

  pressed: { opacity: 0.75 },
});
