import type { CytologyRequest, ConsultationRequest } from "./types";

export const mockConsultations: ConsultationRequest[] = [];
export const mockCytologies: CytologyRequest[] = [];

export function saveMockConsultation(request: ConsultationRequest) {
  mockConsultations.unshift(request);
  return { idConsulta: Date.now(), ...request };
}

export function saveMockCytology(request: CytologyRequest) {
  mockCytologies.unshift(request);
  return { idExame: Date.now(), ...request };
}
