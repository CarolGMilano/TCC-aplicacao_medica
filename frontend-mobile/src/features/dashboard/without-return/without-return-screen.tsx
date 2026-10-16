import { AlertListScreen } from "../components/alert-list-screen";
import { useWithoutReturn } from "./use-without-return";

export function WithoutReturnScreen() {
  const state = useWithoutReturn();
  return (
    <AlertListScreen
      {...state}
      title="Ver e tratar"
      totalPatients={248}
      description="Indicação de ver e tratar há mais de 2 meses sem nova consulta registrada."
    />
  );
}
