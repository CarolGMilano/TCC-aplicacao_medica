import { View } from "react-native";

import { SummaryRow } from "../registration/components";
import {
  cytologyLabels,
  hpvTypeLabels,
  lesionLabels,
  marginLabels,
  pcrResultLabels,
  procedureLabels,
  procedureResultLabels,
  transformationZoneLabels,
} from "../record/constants";
import {
  formatDate,
  type Colposcopy,
  type Consultation,
  type Cytology,
  type Pcr,
  type Procedure,
} from "../record/services/visits-api";
import { TextBlock, styles } from "./components";

// Dados de um registro salvo, só para leitura: os mesmos campos que o web
// mostra ao abrir o registro, com os rótulos do formulário do app.

function label(labels: Record<string, string>, value: string | null) {
  return value ? (labels[value] ?? value) : "—";
}

function yesNo(value: boolean | null) {
  return value ? "Sim" : "Não";
}

export function ConsultationDetails({ item }: { item: Consultation }) {
  const [date, time] = item.dataHora.split("T");
  return (
    <>
      <SummaryRow label="Data do registro" value={formatDate(date)} />
      <SummaryRow label="Horário" value={time ? time.slice(0, 5) : "—"} />
      <TextBlock
        label="Observação"
        value={item.observacao || "Sem observações"}
      />
    </>
  );
}

export function CytologyDetails({ item }: { item: Cytology }) {
  return (
    <>
      <SummaryRow
        label="Data do registro"
        value={formatDate(item.dataRegistro)}
      />
      <SummaryRow
        label="Resultado"
        value={label(cytologyLabels, item.resultado)}
      />
      <TextBlock label="Observação" value={item.observacao || "—"} />
    </>
  );
}

export function PcrDetails({ item }: { item: Pcr }) {
  return (
    <>
      <SummaryRow
        label="Data do registro"
        value={formatDate(item.dataRegistro)}
      />
      <SummaryRow
        label="Resultado"
        value={label(pcrResultLabels, item.resultado)}
      />
      {item.resultado === "POSITIVO" ? (
        <SummaryRow
          label="Tipo de HPV"
          value={
            (item.tiposHpv ?? [])
              .map((type) => label(hpvTypeLabels, type))
              .join(", ") || "—"
          }
        />
      ) : null}
      <TextBlock label="Observação" value={item.observacao || "—"} />
    </>
  );
}

// Como no web, os campos da lesão só aparecem quando há lesão.
export function ColposcopyDetails({ item }: { item: Colposcopy }) {
  return (
    <>
      <SummaryRow
        label="Data do registro"
        value={formatDate(item.dataRegistro)}
      />
      <SummaryRow label="Estrogenização" value={yesNo(item.estrogenizacao)} />
      <SummaryRow label="JEC" value={item.jec ?? "—"} />
      <SummaryRow
        label="Zona de transformação"
        value={label(transformationZoneLabels, item.zt)}
      />
      <SummaryRow label="Lesão" value={yesNo(item.lesao)} />
      {item.lesao ? (
        <>
          <SummaryRow
            label="Grau da lesão"
            value={label(lesionLabels, item.grauLesao)}
          />
          <SummaryRow label="Classificação" value={item.classificacao ?? "—"} />
          <View style={[styles.alertRow, item.recidiva && styles.highlight]}>
            <SummaryRow label="Lesão recidiva" value={yesNo(item.recidiva)} />
          </View>
          <View style={[styles.alertRow, item.verETratar && styles.highlight]}>
            <SummaryRow label="Ver e tratar" value={yesNo(item.verETratar)} />
          </View>
          {item.verETratar ? (
            <View style={[styles.alertRow, styles.highlight]}>
              <TextBlock
                label="Motivo do ver e tratar"
                value={item.verETratarMotivo || "—"}
              />
            </View>
          ) : null}
        </>
      ) : null}
      <TextBlock label="Observação" value={item.observacao || "—"} />
    </>
  );
}

// Biópsia não tem margens, como no formulário.
export function ProcedureDetails({ item }: { item: Procedure }) {
  return (
    <>
      <SummaryRow
        label="Data do registro"
        value={formatDate(item.dataRegistro)}
      />
      <SummaryRow label="Tipo" value={label(procedureLabels, item.tipo)} />
      <SummaryRow label="Fragmentos" value={String(item.qtFragmento ?? "—")} />
      {item.tipo !== "BIOPSIA" ? (
        <>
          <SummaryRow
            label="Margem endocervical"
            value={label(marginLabels, item.margemEndocervical)}
          />
          <SummaryRow
            label="Margem ectocervical"
            value={label(marginLabels, item.margemEctocervical)}
          />
        </>
      ) : null}
      <SummaryRow
        label="Resultado"
        value={label(procedureResultLabels, item.resultado)}
      />
      <TextBlock label="Observação" value={item.observacao || "—"} />
    </>
  );
}
