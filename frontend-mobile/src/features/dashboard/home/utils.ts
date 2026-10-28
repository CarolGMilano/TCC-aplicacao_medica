import { router } from "expo-router";

export function openPatient(id: number) {
  router.push({ pathname: "/patients/[id]", params: { id: String(id) } });
}

// Dias desde uma data dd/mm/aaaa; null quando não há data.
export function daysSince(date: string) {
  const [day, month, year] = date.split("/").map(Number);
  if (!year) return null;
  const diff = Date.now() - new Date(year, month - 1, day).getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}
