import { useSyncExternalStore } from "react";

export type RecentPatient = { id: number; name: string };

// Fichas abertas nesta sessão do app, da mais recente para a mais antiga.
let recent: RecentPatient[] = [];
const listeners = new Set<() => void>();

export function addRecentPatient(patient: RecentPatient) {
  recent = [patient, ...recent.filter((item) => item.id !== patient.id)].slice(
    0,
    6,
  );
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useRecentPatients() {
  return useSyncExternalStore(subscribe, () => recent);
}
