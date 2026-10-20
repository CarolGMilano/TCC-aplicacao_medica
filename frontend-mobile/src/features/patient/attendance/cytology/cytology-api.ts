import { saveAttendance } from "../attendance-api";
import { saveMockCytology } from "../mocks";
import type { CytologyRequest } from "../types";

export const USE_MOCK_CYTOLOGY = false;

// Sem id, cria a citologia; com id, altera a citologia salva.
export async function saveCytology(request: CytologyRequest, id?: number) {
  if (USE_MOCK_CYTOLOGY) return saveMockCytology(request);

  return saveAttendance(
    "/api/citologias",
    request,
    "Não foi possível salvar a citologia.",
    id,
  );
}
