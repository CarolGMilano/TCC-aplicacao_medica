export enum StatusPaciente {
  EM_INVESTIGACAO = 'EM_INVESTIGACAO',
  EM_TRATAMENTO = 'EM_TRATAMENTO',
  AGUARDANDO_PROCEDIMENTO = 'AGUARDANDO_PROCEDIMENTO',
  POS_PROCEDIMENTO = 'POS_PROCEDIMENTO',
  ACOMPANHAMENTO_PREVENTIVO = 'ACOMPANHAMENTO_PREVENTIVO',
  ALTA = 'ALTA'
}

export const StatusPacienteLabel = {
  [StatusPaciente.EM_INVESTIGACAO]: 'Em investigação',
  [StatusPaciente.EM_TRATAMENTO]: 'Em tratamento',
  [StatusPaciente.AGUARDANDO_PROCEDIMENTO]: 'Aguardando procedimento',
  [StatusPaciente.POS_PROCEDIMENTO]: 'Pós-procedimento',
  [StatusPaciente.ACOMPANHAMENTO_PREVENTIVO]: 'Acompanhamento preventivo',
  [StatusPaciente.ALTA]: 'Alta'
};