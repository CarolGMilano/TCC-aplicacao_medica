import { IPaciente } from "./IPaciente";

export interface IPacienteResponse {
  content: IPaciente[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}