import { showDialog } from "@/components/shared/discard-dialog";

import { fetchVisits, formatDate } from "../record/services/visits-api";
import type { VisitType } from "../record/types";

type ConfirmSaveOptions = {
  patientId: number;
  patientName: string;
  type: VisitType;
  typeLabel: string;
  dataRegistro: string;
  // Editando um registro salvo: não conta ele mesmo como duplicado.
  editingId?: number;
  // Resumo do resultado grave (ex.: "HSIL"); sem ele, não pede confirmação
  // pelo resultado.
  critical?: string | null;
};

// Última conferência antes de gravar: um resultado grave mostra o resumo
// (paciente, exame, data) para não ser lançado na paciente errada, e um
// registro do mesmo tipo na mesma data avisa que pode ser duplicado.
// Resolve true para salvar.
export async function confirmBeforeSave({
  patientId,
  patientName,
  type,
  typeLabel,
  dataRegistro,
  editingId,
  critical,
}: ConfirmSaveOptions) {
  const date = formatDate(dataRegistro);
  let duplicate = false;

  try {
    const lists = await fetchVisits(patientId);
    duplicate = lists[type].some(
      (visit) => visit.id !== editingId && visit.date.startsWith(date),
    );
  } catch {
    // Sem a lista, segue sem o aviso; o salvamento não depende dele.
  }

  if (!critical && !duplicate) return true;

  const lines = [
    critical
      ? `${typeLabel}: ${critical}\nPaciente: ${patientName}\nData: ${date}`
      : null,
    duplicate
      ? `Já existe ${typeLabel.toLowerCase()} registrada para esta paciente em ${date}.`
      : null,
  ].filter(Boolean);

  return new Promise<boolean>((resolve) => {
    showDialog({
      title: critical ? "Confirmar resultado" : "Possível registro duplicado",
      message: lines.join("\n\n"),
      primary: { label: "Salvar", onPress: () => resolve(true) },
      secondary: { label: "Revisar", onPress: () => resolve(false) },
      onDismiss: () => resolve(false),
    });
  });
}
