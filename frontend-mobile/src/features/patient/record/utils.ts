import {
  contraceptionMap,
  initialForm,
  istMap,
  istOptions,
  smokingMap,
  statusMap,
} from "../registration/constants";
import type { SmokingStatus } from "../registration/types";
import type { PatientDetail, PatientRecord } from "./types";

// Os mapas do cadastro vão do texto da tela para o enum do backend;
// aqui fazemos o caminho inverso, do enum para o texto.
function invert(map: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(map).map(([label, value]) => [value, label]),
  );
}

const statusLabels = invert(statusMap);
const contraceptionLabels = invert(contraceptionMap);
const smokingLabels = invert(smokingMap) as Record<string, SmokingStatus>;
const istLabels = invert(istMap);

// Converte a resposta do backend no mesmo formato do formulário de cadastro,
// para reaproveitar textos e cálculos (idade, carga tabágica) nas abas.
export function toPatientRecord(detail: PatientDetail): PatientRecord {
  const [year, month, day] = detail.dataNascimento.split("-");
  const obstetric = detail.dadosGinecoObstetricos[0];
  const sexual = detail.saudeSexual[0];
  const habits = detail.historicoTabagismo[0];
  const ists = detail.historicoIst;

  return {
    id: detail.idPaciente,
    age: detail.idade,
    priorityGroup: detail.grupoPrioritario,
    ids: {
      obstetric: obstetric?.idDados,
      sexual: sexual?.idDados,
      habits: habits?.idHistorico,
      ists,
    },
    missing: {
      obstetric: !obstetric,
      sexual: !sexual,
      ist: ists.length === 0,
      habits: !habits,
    },
    form: {
      ...initialForm,
      name: detail.nome,
      birthDay: day,
      birthMonth: month,
      birthYear: year,
      record: detail.prontuario,
      status: statusLabels[detail.status] ?? detail.status,
      ...(obstetric && {
        pregnancies: obstetric.numGestacao,
        vaginalBirths: obstetric.numPartoNormal,
        cesareans: obstetric.numCesariana,
        abortions: obstetric.numAborto,
        menarche: obstetric.menarca,
        menopause: obstetric.menopausa !== null,
        menopauseAge: obstetric.menopausa ?? initialForm.menopauseAge,
      }),
      ...(sexual && {
        sexarche: sexual.sexarca,
        vvs: sexual.vvs,
        contraception: contraceptionLabels[sexual.mac] ?? sexual.mac,
        partners: sexual.numParceiros,
      }),
      // Mantém a ordem das opções da tela, não a ordem de cadastro.
      ists: ists
        .map((item) => istLabels[item.ist] ?? item.ist)
        .sort((a, b) => istOptions.indexOf(a) - istOptions.indexOf(b)),
      hpvWart: ists.some((item) => item.ist === "HPV" && item.condilomaHpv),
      ...(habits && {
        smoking: smokingLabels[habits.fumante] ?? "Nunca",
        smokingStart: habits.idadeInicio ?? initialForm.smokingStart,
        smokingEnd: habits.idadeFim ?? initialForm.smokingEnd,
        cigarettesPerDay: habits.cigarrosDia ?? 0,
      }),
    },
  };
}

export function formatBirthDate(record: PatientRecord) {
  const { birthDay, birthMonth, birthYear } = record.form;
  return `${birthDay}/${birthMonth}/${birthYear}`;
}

export const yesNo = (value: boolean) => (value ? "Sim" : "Não");
