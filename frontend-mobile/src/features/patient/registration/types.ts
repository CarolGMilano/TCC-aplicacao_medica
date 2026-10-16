export type SmokingStatus = "Fuma" | "Parou" | "Nunca";

export type PatientForm = {
  name: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  record: string;
  status: string;
  pregnancies: number;
  vaginalBirths: number;
  cesareans: number;
  abortions: number;
  menarche: number;
  menopause: boolean;
  menopauseAge: number;
  sexarche: number;
  // Enviado como "vvs" para o backend. Confirmar o significado com as médicas.
  vvs: boolean;
  contraception: string;
  partners: number;
  ists: string[];
  hpvWart: boolean;
  smoking: SmokingStatus;
  smokingStart: number;
  smokingEnd: number;
  cigarettesPerDay: number;
};

export type UpdatePatient = <Key extends keyof PatientForm>(
  key: Key,
  value: PatientForm[Key],
) => void;

export type StepProps = {
  form: PatientForm;
  update: UpdatePatient;
};
