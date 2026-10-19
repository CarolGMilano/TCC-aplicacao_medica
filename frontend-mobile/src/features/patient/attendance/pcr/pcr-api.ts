import { saveAttendance } from "../attendance-api";
import type { PcrRequest } from "../types";

// Sem id, cria o PCR; com id, altera o PCR salvo.
export function savePcr(request: PcrRequest, id?: number) {
  return saveAttendance(
    "/api/pcr",
    request,
    "Não foi possível salvar o PCR.",
    id,
  );
}
