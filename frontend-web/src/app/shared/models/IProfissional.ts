import { TipoUsuario } from "./EnumTipoUsuario";

export interface IProfissional {
  ativo: boolean;
  crm: string;
  email: string;
  especialidade: string;
  idMedico: number;
  idUsuario: number;
  nome: string;
  tipo: TipoUsuario;
}