import { saveAttendance } from "../attendance-api";
import type { ProcedureRequest } from "../types";

// Sem id, cria o procedimento; com id, altera o procedimento salvo.
export function saveProcedure(request: ProcedureRequest, id?: number) {
  return saveAttendance(
    "/api/procedimentos",
    request,
    "Não foi possível salvar o procedimento.",
    id,
  );
}
