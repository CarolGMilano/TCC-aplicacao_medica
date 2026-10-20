import { saveAttendance } from "../attendance-api";
import type { ColposcopyRequest } from "../types";

// Sem id, cria a colposcopia; com id, altera a colposcopia salva.
export function saveColposcopy(request: ColposcopyRequest, id?: number) {
  return saveAttendance(
    "/api/colposcopias",
    request,
    "Não foi possível salvar a colposcopia.",
    id,
  );
}
