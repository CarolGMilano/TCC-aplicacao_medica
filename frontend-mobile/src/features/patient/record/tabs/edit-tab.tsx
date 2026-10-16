import {
  HabitsStep,
  IstStep,
  ObstetricStep,
  PersonalStep,
  SexualStep,
} from "../../registration/steps";
import type { StepProps } from "../../registration/types";
import type { DataTab } from "../types";

type EditTabProps = StepProps & {
  tab: DataTab;
};

// No modo edição, cada aba usa a mesma etapa do cadastro.
export function EditTab({ tab, form, update }: EditTabProps) {
  switch (tab) {
    case "personal":
      return <PersonalStep form={form} update={update} />;
    case "obstetric":
      return <ObstetricStep form={form} update={update} />;
    case "sexual":
      return <SexualStep form={form} update={update} />;
    case "ist":
      return <IstStep form={form} update={update} />;
    case "habits":
      return <HabitsStep form={form} update={update} />;
  }
}
