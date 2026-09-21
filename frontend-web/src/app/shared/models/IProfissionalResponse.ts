import { IProfissional } from "./IProfissional";

export interface IProfissionaisResponse {
  content: IProfissional[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}