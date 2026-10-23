import { AlertListScreen } from "../components/alert-list-screen";
import { TOTAL_PATIENTS } from "../home/mocks";
import { useReturns } from "./use-returns";

export function ReturnsScreen() {
  const { alerts, error, isLoading } = useReturns();
  return (
    <AlertListScreen
      alerts={alerts}
      error={error}
      isLoading={isLoading}
      eyebrow="Sem retorno"
      title="Precisam de retorno"
      totalPatients={TOTAL_PATIENTS}
      description="Ver e tratar há mais de 2 meses ou EZT/biópsia há mais de 3 meses sem nova consulta."
    />
  );
}
