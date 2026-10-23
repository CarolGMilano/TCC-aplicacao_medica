import { getSmokingLoad } from "../../registration/utils";
import { InfoCard, InfoField } from "../components/info-card";
import type { DataTab, PatientRecord } from "../types";
import { formatBirthDateShort, yesNo } from "../utils";

type HistoryTabProps = {
  record: PatientRecord;
  onEdit: (section: DataTab) => void;
};

const smokingLabels = {
  Fuma: "Fumante",
  Parou: "Ex-fumante",
  Nunca: "Nunca fumou",
};

const notApplicable = "Não se aplica";

// Histórico clínico numa tela só: um card por bloco, na ordem do cadastro,
// cada um com o próprio "Editar". Campos que não se aplicam continuam
// visíveis, para o médico saber que a pergunta foi feita.
export function HistoryTab({ record, onEdit }: HistoryTabProps) {
  const { form, missing } = record;
  const smokes = form.smoking !== "Nunca";
  const stopped = form.smoking === "Parou";
  const hasHpv = form.ists.includes("HPV");

  return (
    <>
      <InfoCard title="Identificação" onEdit={() => onEdit("personal")}>
        <InfoField label="Nome completo" value={form.name} full />
        <InfoField label="Nascimento" value={formatBirthDateShort(record)} />
        <InfoField label="Idade" value={`${record.age} anos`} />
        <InfoField label="Prontuário" value={form.record} />
        <InfoField label="Status" value={form.status} />
        <InfoField
          label="Grupo prioritário"
          value={record.priorityGroup ? "Sim" : "Não"}
          full
        />
      </InfoCard>

      <InfoCard
        title="Gineco-obstétrico"
        onEdit={() => onEdit("obstetric")}
        editLabel={missing.obstetric ? "Preencher" : "Editar"}
      >
        {missing.obstetric ? (
          <InfoField label="Dados" value="Não registrados" full />
        ) : (
          <>
            <InfoField label="Gestações" value={String(form.pregnancies)} />
            <InfoField label="Abortos" value={String(form.abortions)} />
            <InfoField
              label="Partos normais"
              value={String(form.vaginalBirths)}
            />
            <InfoField label="Cesarianas" value={String(form.cesareans)} />
            <InfoField label="Menarca" value={`aos ${form.menarche} anos`} />
            <InfoField
              label="Menopausa"
              value={form.menopause ? `aos ${form.menopauseAge} anos` : "Não"}
            />
          </>
        )}
      </InfoCard>

      <InfoCard
        title="Vida sexual"
        onEdit={() => onEdit("sexual")}
        editLabel={missing.sexual ? "Preencher" : "Editar"}
      >
        {missing.sexual ? (
          <InfoField label="Dados" value="Não registrados" full />
        ) : (
          <>
            <InfoField label="Sexarca" value={`aos ${form.sexarche} anos`} />
            <InfoField label="Nº de parceiros" value={String(form.partners)} />
            <InfoField label="VVS" value={yesNo(form.vvs)} />
            <InfoField
              label="Método contraceptivo"
              value={form.contraception}
              full
            />
          </>
        )}
      </InfoCard>

      <InfoCard
        title="IST"
        onEdit={() => onEdit("ist")}
        editLabel={missing.ist ? "Preencher" : "Editar"}
      >
        {missing.ist ? (
          <InfoField label="Dados" value="Não registrados" full />
        ) : (
          <>
            <InfoField label="Histórico" value={form.ists.join(" · ")} full />
            <InfoField
              label="Condiloma HPV"
              value={hasHpv ? yesNo(form.hpvWart) : notApplicable}
              full
            />
          </>
        )}
      </InfoCard>

      <InfoCard
        title="Tabagismo"
        onEdit={() => onEdit("habits")}
        editLabel={missing.habits ? "Preencher" : "Editar"}
      >
        {missing.habits ? (
          <InfoField label="Dados" value="Não registrados" full />
        ) : (
          <>
            <InfoField label="Situação" value={smokingLabels[form.smoking]} />
            <InfoField
              label="Carga tabágica"
              value={smokes ? getSmokingLoad(form) : notApplicable}
              highlight={smokes}
            />
            <InfoField
              label="Começou aos"
              value={smokes ? `${form.smokingStart} anos` : notApplicable}
            />
            <InfoField
              label="Parou aos"
              value={stopped ? `${form.smokingEnd} anos` : notApplicable}
            />
            <InfoField
              label="Cigarros por dia"
              value={smokes ? String(form.cigarettesPerDay) : notApplicable}
              full
            />
          </>
        )}
      </InfoCard>
    </>
  );
}
