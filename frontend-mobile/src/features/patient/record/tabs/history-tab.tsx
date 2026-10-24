import { getSmokingLoad } from "../../registration/utils";
import { InfoCard, InfoField } from "../components/info-card";
import type { DataTab, PatientRecord } from "../types";
import { formatBirthDateShort, yesNo } from "../utils";

type HistoryTabProps = {
  record: PatientRecord;
  tab: DataTab;
};

const smokingLabels = {
  Fuma: "Fumante",
  Parou: "Ex-fumante",
  Nunca: "Nunca fumou",
};

const notApplicable = "Não se aplica";

// Dados de um bloco do cadastro (uma aba da ficha). O "Editar dados" fica no
// rodapé. Campos que não se aplicam continuam visíveis, para o médico saber
// que a pergunta foi feita.
export function HistoryTab({ record, tab }: HistoryTabProps) {
  const { form, missing } = record;
  const smokes = form.smoking !== "Nunca";
  const stopped = form.smoking === "Parou";
  const hasHpv = form.ists.includes("HPV");

  return (
    <>
      {tab === "personal" && (
        <InfoCard title="Identificação">
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
      )}

      {tab === "obstetric" && (
        <InfoCard title="Gineco-obstétrico">
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
      )}

      {tab === "sexual" && (
        <InfoCard title="Vida sexual">
          {missing.sexual ? (
            <InfoField label="Dados" value="Não registrados" full />
          ) : (
            <>
              <InfoField label="Sexarca" value={`aos ${form.sexarche} anos`} />
              <InfoField
                label="Nº de parceiros"
                value={String(form.partners)}
              />
              <InfoField label="VVS" value={yesNo(form.vvs)} />
              <InfoField
                label="Método contraceptivo"
                value={form.contraception}
                full
              />
            </>
          )}
        </InfoCard>
      )}

      {tab === "ist" && (
        <InfoCard title="IST">
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
      )}

      {tab === "habits" && (
        <InfoCard title="Tabagismo">
          {missing.habits ? (
            <InfoField label="Dados" value="Não registrados" full />
          ) : (
            <>
              <InfoField label="Situação" value={smokingLabels[form.smoking]} />
              <InfoField
                label="Carga tabágica"
                value={smokes ? getSmokingLoad(form) : notApplicable}
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
      )}
    </>
  );
}
