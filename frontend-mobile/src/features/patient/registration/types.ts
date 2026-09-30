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
  sexarche: number;
  multiplePartners: boolean;
  contraception: string;
  partners: number;
  ist: string;
  hpvWart: boolean;
  smoking: string;
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
