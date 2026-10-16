import { Mac } from "./EnumMac";

export interface ISaudeSexualRequest {
  idPaciente: number,
  sexarca: number,
  mac: Mac,
  numParceiros: number,
  vvs: boolean
}