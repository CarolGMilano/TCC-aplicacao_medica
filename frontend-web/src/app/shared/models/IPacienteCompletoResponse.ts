import { StatusPaciente } from "./EnumStatusPaciente";
import { IDadosGinecoObstetricos } from "./IDadosGinecoObstetricos";
import { ISaudeSexual } from "./ISaudeSexual";
import { IHistoricoTabagismo } from "./IHistoricoTabagismo";
import { IHistoricoIst } from "./IHistoricoIst";

export interface IPacienteCompletoResponse {
  idPaciente: number;
  nome: string;
  dataNascimento: string;
  idade: number;
  prontuario: string;
  status: StatusPaciente;
  grupoPrioritario: boolean;
  dadosGinecoObstetricos: IDadosGinecoObstetricos[];
  saudeSexual: ISaudeSexual[];
  historicoTabagismo: IHistoricoTabagismo[];
  historicoIst: IHistoricoIst[];
}