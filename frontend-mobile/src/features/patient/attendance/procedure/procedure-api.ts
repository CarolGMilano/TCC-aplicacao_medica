import { saveAttendance } from "../attendance-api";
import type { ProcedureRequest } from "../types";

export function createProcedure(request: ProcedureRequest) {
  return saveAttendance(
    "/api/procedimentos",
    request,
    "Não foi possível salvar o procedimento.",
  );
}
