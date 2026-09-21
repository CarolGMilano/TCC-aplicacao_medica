export enum TipoUsuario {
  MEDICO = 'MEDICO',
  RESIDENTE = 'RESIDENTE',
  ADMINISTRADOR = 'ADMINISTRADOR'
}

export const TipoUsuarioLabel = {
  [TipoUsuario.MEDICO]: 'Médico',
  [TipoUsuario.RESIDENTE]: 'Residente',
  [TipoUsuario.ADMINISTRADOR]: 'Administrador'
};