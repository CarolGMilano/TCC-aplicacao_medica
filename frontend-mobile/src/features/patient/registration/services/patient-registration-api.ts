import { getToken } from '@/features/auth/auth-session';
import { API_BASE_URL } from '@/features/auth/services/auth-api';

export type PatientRegistration = {
  paciente: {
    nome: string;
    dataNascimento: string;
    prontuario: string;
    status: string;
  };
  dadosGinecoObstetricos: {
    numGestacao: number;
    numPartoNormal: number;
    numCesariana: number;
    numAborto: number;
    menarca: number;
    menopausa: number | null;
  };
  saudeSexual: {
    sexarca: number;
    mac: string;
    numParceiros: number;
    vvs: boolean;
  };
  historicoTabagismo: {
    cigarrosDia: number;
    idadeInicio: number;
    idadeFim: number;
    fumante: string;
  };
  historicoIst: {
    ist: string;
    condilomaHpv: boolean;
  }[];
};

export async function registerPatient(
  data: PatientRegistration,
): Promise<void> {
  const token = getToken();

  if (!token) {
    throw new Error('Sua sessão expirou. Faça login novamente.');
  }

  const response = await fetch(`${API_BASE_URL}/api/pacientes/completo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Sua sessão expirou. Faça login novamente.');
    }

    throw new Error('Não foi possível cadastrar a paciente.');
  }
}