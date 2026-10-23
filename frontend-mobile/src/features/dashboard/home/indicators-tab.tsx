import { View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";

import { indicators } from "./mocks";
import { Bars, Card, StatRow, Tile, TileRow, dashboardStyles } from "./ui";

export function IndicatorsTab() {
  const { exams, cytology, pcr, seeAndTreat } = indicators;

  return (
    <View style={dashboardStyles.tab}>
      <ThemedText type="small" themeColor="textSecondary">
        {indicators.period}
      </ThemedText>

      <TileRow>
        <Tile value={exams.value} label={`exames no mês · ${exams.change}`} />
        <Tile value={indicators.changedPercent} label="alterados" tone="warning" />
      </TileRow>

      <Card title="Citologia por resultado">
        <Bars items={cytology} />
      </Card>

      <Card title="PCR DNA-HPV">
        <Bars items={pcr} />
      </Card>

      <Card title="Tempo até a colposcopia">
        <StatRow label="Média" value={`${indicators.colposcopyDays} dias`} />
      </Card>

      <Card title="Ver e tratar">
        <StatRow label="Realizados" value={seeAndTreat.done} />
        <StatRow
          label="Margem comprometida"
          value={seeAndTreat.compromisedMargin}
        />
      </Card>
    </View>
  );
}
