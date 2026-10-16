import { ChoiceRow } from "./choice-row";

type ToggleRowProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function ToggleRow({ label, value, onChange }: ToggleRowProps) {
  return (
    <ChoiceRow
      label={label}
      options={["Sim", "Não"]}
      selected={value ? "Sim" : "Não"}
      onSelect={(choice) => onChange(choice === "Sim")}
      inline
    />
  );
}
