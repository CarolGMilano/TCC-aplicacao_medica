import { EmptyState } from "../components";

type VisitsTabProps = {
  created: boolean;
};

// A lista de atendimentos entra na parte 3; por enquanto só o estado vazio.
export function VisitsTab({ created }: VisitsTabProps) {
  if (created) {
    return (
      <EmptyState
        title="Nenhum atendimento ainda"
        note="Lance a primeira colposcopia, exame, procedimento ou consulta desta paciente."
      />
    );
  }

  return (
    <EmptyState
      title="Atendimentos em breve"
      note="A lista de atendimentos desta paciente ainda não está disponível no app."
    />
  );
}
