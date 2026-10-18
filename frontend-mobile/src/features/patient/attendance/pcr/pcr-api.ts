import { postAttendance } from "../attendance-api";
import type { PcrRequest } from "../types";

export function createPcr(request: PcrRequest) {
  return postAttendance("/api/pcr", request, "Não foi possível salvar o PCR.");
}
