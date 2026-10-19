import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Spacing, Theme } from "@/constants/theme";
import { ThemedText } from "@/components/shared/themed-text";

import { fetchVisit, type VisitResponses } from "../record/services/visits-api";
import type { VisitType } from "../record/types";
import { AttendanceForm } from "./attendance-form";
import { AttendanceHeader, styles as componentStyles } from "./components";

// Tela de um tipo de registro. Sem recordId, mostra o formulário de novo
// registro. Com recordId (toque num atendimento da ficha), busca o registro
// salvo e mostra os dados (details); com editable, "Editar registro" abre o
// mesmo formulário já preenchido. O formulário só é montado depois da busca,
// para os campos começarem com os valores salvos.
export function SavedVisit<Type extends VisitType>({
  type,
  title,
  details,
  editable,
  children,
}: {
  type: Type;
  title: string;
  details: (saved: VisitResponses[Type]) => ReactNode;
  editable?: boolean;
  children: (saved: VisitResponses[Type] | null) => ReactNode;
}) {
  const { id, recordId } = useLocalSearchParams<{
    id: string;
    recordId?: string;
  }>();
  const [saved, setSaved] = useState<VisitResponses[Type] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!recordId) return;
    let active = true;

    fetchVisit(type, Number(id), Number(recordId))
      .then((item) => {
        if (active) setSaved(item);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar o registro.",
        );
      });

    return () => {
      active = false;
    };
  }, [type, id, recordId]);

  if (!recordId) return children(null);

  if (!saved) {
    return (
      <SafeAreaView style={componentStyles.screen} edges={["top", "bottom"]}>
        <AttendanceHeader title={title} mode="view" />
        {error ? (
          <ThemedText themeColor="error" style={styles.message}>
            {error}
          </ThemedText>
        ) : (
          <ActivityIndicator style={styles.message} color={Theme.primary} />
        )}
      </SafeAreaView>
    );
  }

  if (editing) return children(saved);

  return (
    <AttendanceForm
      title={title}
      mode="view"
      saved={saved}
      onSave={editable ? () => setEditing(true) : undefined}
      buttonLabel="Editar registro"
    >
      {details(saved)}
    </AttendanceForm>
  );
}

const styles = StyleSheet.create({
  message: {
    padding: Spacing.four,
    textAlign: "center",
  },
});
