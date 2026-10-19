import { saveAttendance } from "../attendance-api";
import type { PcrRequest } from "../types";

export function createPcr(request: PcrRequest) {
  return saveAttendance("/api/pcr", request, "Não foi possível salvar o PCR.");
}
