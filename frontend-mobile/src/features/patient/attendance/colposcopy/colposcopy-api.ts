import { saveAttendance } from "../attendance-api";
import type { ColposcopyRequest } from "../types";

export function createColposcopy(request: ColposcopyRequest) {
  return saveAttendance(
    "/api/colposcopias",
    request,
    "Não foi possível salvar a colposcopia.",
  );
}
