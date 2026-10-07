import { mockPatients } from "../mocks/patients";
import type { PatientListItem } from "../types";

// Fonte temporária da lista enquanto a integração com o backend não é ativada.
export async function fetchPatients(
  _search = "",
  _status = "Todas",
): Promise<PatientListItem[]> {
  return mockPatients.map((patient) => ({ ...patient }));
}
