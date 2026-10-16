import { AlertListScreen } from "../components/alert-list-screen";
import { usePostProcedure } from "./use-post-procedure";

export function PostProcedureScreen() {
  const state = usePostProcedure();
  return (
    <AlertListScreen
      {...state}
      title="Pós-procedimento"
      totalPatients={248}
      description="EZT ou biópsia realizada há mais de 3 meses sem consulta de acompanhamento."
    />
  );
}
