import { Theme } from "@/constants/theme";
import { usePatientList } from "@/features/patient/list/use-patient-list";

import { AlertListScreen } from "../components/alert-list-screen";
import { TOTAL_PATIENTS } from "../home/mocks";
import { daysSince } from "../home/utils";
import type { DashboardAlert } from "../types";

const WAITING = "Aguardando procedimento";

// Pacientes aguardando procedimento, de quem espera há mais tempo (contado
// desde a última consulta). Sem consulta registrada fica no fim.
export function WaitingScreen() {
  const { filteredPatients, error, isLoading } = usePatientList(WAITING, "");

  const alerts: DashboardAlert[] = filteredPatients
    .map((patient) => ({
      idPaciente: patient.id,
      nome: patient.name,
      prontuario: patient.record,
      status: patient.status,
      diasAtraso: daysSince(patient.lastVisit) ?? -1,
      tipoAlerta: "AGUARDANDO_PROCEDIMENTO",
    }))
    .sort((a, b) => b.diasAtraso - a.diasAtraso);

  return (
    <AlertListScreen
      alerts={alerts}
      error={error}
      isLoading={isLoading}
      eyebrow="Fila"
      accent={Theme.warning}
      title="Aguardando procedimento"
      totalPatients={TOTAL_PATIENTS}
      description="De quem espera há mais tempo, contando desde a última consulta."
      daysLabel={(alert) =>
        alert.diasAtraso < 0 ? "Sem consultas" : `${alert.diasAtraso} dias`
      }
    />
  );
}
