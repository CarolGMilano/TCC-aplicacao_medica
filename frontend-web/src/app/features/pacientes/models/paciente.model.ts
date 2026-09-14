export interface Paciente {
  idPaciente: number;
  nome: string;
  dataNascimento: string;
  idade: number;
  prontuario: string;
  status: string;
  grupoPrioritario: boolean;
}

export interface Pagina<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
