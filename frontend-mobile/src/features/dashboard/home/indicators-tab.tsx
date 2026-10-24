import { View } from "react-native";

import { ThemedText } from "@/components/shared/themed-text";

import { indicators } from "./mocks";
import { Bars, Card, StatRow, dashboardStyles } from "./ui";

export function IndicatorsTab() {
  const { exams, cytology, pcr, seeAndTreat } = indicators;

  return (
    <View style={dashboardStyles.tab}>
      <ThemedText type="small" themeColor="textSecondary">
        {indicators.period}
      </ThemedText>

      <Card title="Exames no mês">
        <ThemedText style={dashboardStyles.bigValue}>{exams.value}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {exams.change}
        </ThemedText>
      </Card>

      <Card title="Citologia por resultado">
        <Bars items={cytology} />
      </Card>

      <Card title="PCR DNA-HPV">
        <Bars items={pcr} />
      </Card>

      <Card title="Ver e tratar">
        <StatRow label="Realizados no mês" value={seeAndTreat.done} />
      </Card>
    </View>
  );
}
