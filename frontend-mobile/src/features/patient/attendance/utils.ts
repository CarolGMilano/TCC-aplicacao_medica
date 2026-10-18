export type DateParts = [day: string, month: string, year: string];

export function todayParts(): DateParts {
  const now = new Date();
  return [
    String(now.getDate()).padStart(2, "0"),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getFullYear()),
  ];
}

// Data no formato do backend (AAAA-MM-DD), ou null se não existir ou estiver
// fora do intervalo aceito no web (01/01/1900 até hoje).
export function toIsoDate([day, month, year]: DateParts) {
  if (!day || !month || year.length !== 4) return null;

  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const exists =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);
  if (!exists || date.getFullYear() < 1900 || date > new Date()) return null;

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// Os botões de opção mostram o texto; o backend recebe a chave do enum.
export function keyOf(labels: Record<string, string>, label: string) {
  return Object.keys(labels).find((key) => labels[key] === label) ?? null;
}
