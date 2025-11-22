export function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function sanitizeRegistrationDate(value) {
  const trimmed = (value || '').toString().trim();
  if (!trimmed) return getTodayIso();
  const test = new Date(trimmed);
  if (isNaN(test.getTime())) return getTodayIso();
  return trimmed;
}
