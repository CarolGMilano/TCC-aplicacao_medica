import { TipoUsuario } from "./EnumTipoUsuario";

export interface IProfissionalRequest {
  nome: string,
  crm: string,
  especialidade: string,
  email: string,
  senha: string,
  tipo: TipoUsuario
}
