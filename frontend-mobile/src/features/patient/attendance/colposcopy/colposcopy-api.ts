import { postAttendance } from "../attendance-api";
import type { ColposcopyRequest } from "../types";

export function createColposcopy(request: ColposcopyRequest) {
  return postAttendance(
    "/api/colposcopias",
    request,
    "Não foi possível salvar a colposcopia.",
  );
}
