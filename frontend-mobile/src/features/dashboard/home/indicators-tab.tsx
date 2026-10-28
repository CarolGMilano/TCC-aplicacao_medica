import { ActivityIndicator, View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";
import { Theme } from "@/constants/theme";

import {
  fetchExamIndicators,
  type ExamIndicatorsResponse,
} from "../services/indicators-api";
import { Bars, Card, StatRow, dashboardStyles } from "./ui";
import { useRequest } from "./use-request";

const months = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

// "2026-10" -> mês atual e anterior por extenso.
function monthNames(value: string) {
  const [year, month] = value.split("-").map(Number);
  const current = months[month - 1];
  const previous = months[(month + 10) % 12];
  return {
    period: `${current[0].toUpperCase()}${current.slice(1)} ${year} · comparado a ${previous}`,
    previous,
  };
}

// Citologia agrupada como no gráfico: os resultados graves somam em "HSIL
// ou mais"; os demais raros em "Outros".
function cytologyBars(
  results: ExamIndicatorsResponse["citologiaPorResultado"],
) {
  const groups = { NILM: 0, ASC_US: 0, LSIL: 0, HSIL: 0, OUTROS: 0 };
  for (const { resultado, total } of results) {
    if (
      resultado === "NILM" ||
      resultado === "ASC_US" ||
      resultado === "LSIL"
    ) {
      groups[resultado] += total;
    } else if (
      resultado.startsWith("HSIL") ||
      resultado.startsWith("CARCINOMA") ||
      resultado.startsWith("ADENOCARCINOMA")
    ) {
      groups.HSIL += total;
    } else {
      groups.OUTROS += total;
    }
  }
  return [
    { label: "Normal (NILM)", count: groups.NILM, color: Theme.primary },
    { label: "ASC-US", count: groups.ASC_US, color: Theme.tertiary },
    { label: "LSIL", count: groups.LSIL, color: Theme.warning },
    { label: "HSIL ou mais grave", count: groups.HSIL, color: Theme.error },
    { label: "Outros", count: groups.OUTROS, color: Theme.border },
  ].filter((bar) => bar.label !== "Outros" || bar.count > 0);
}

export function IndicatorsTab() {
  const { data, error, isLoading } = useRequest(fetchExamIndicators);

  if (isLoading) {
    return (
      <ActivityIndicator color={Theme.primary} style={{ marginTop: 24 }} />
    );
  }
  if (error || !data) {
    return <ThemedText themeColor="error">{error}</ThemedText>;
  }

  const { period, previous } = monthNames(data.mes);
  const change =
    data.variacaoPercentual === null
      ? `Sem exames em ${previous} para comparar`
      : `${data.variacaoPercentual >= 0 ? "↑" : "↓"} ${Math.abs(data.variacaoPercentual).toLocaleString("pt-BR")}% em relação a ${previous}`;
  const { negativo, hpv16ou18, outros } = data.pcrPorResultado;

  return (
    <View style={dashboardStyles.tab}>
      <ThemedText type="small" themeColor="textSecondary">
        {period}
      </ThemedText>

      <Card title="Exames no mês">
        <ThemedText style={dashboardStyles.bigValue}>
          {data.examesNoMes}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {change}
        </ThemedText>
      </Card>

      <Card title="Citologia por resultado">
        <Bars items={cytologyBars(data.citologiaPorResultado)} />
      </Card>

      <Card title="PCR DNA-HPV">
        <Bars
          items={[
            { label: "Negativo", count: negativo, color: Theme.primary },
            { label: "HPV 16/18", count: hpv16ou18, color: Theme.error },
            { label: "Outros tipos", count: outros, color: Theme.warning },
          ]}
        />
      </Card>

      <Card title="Ver e tratar">
        <StatRow label="Realizados no mês" value={data.verETratarRealizados} />
      </Card>
    </View>
  );
}
