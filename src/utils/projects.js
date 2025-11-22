export const PROJECT_OPTIONS = ['Project', 'Dissertation', 'Thesis'];

export function normalizeProjectType(value) {
  const raw = (value || '').toString().trim().toLowerCase();
  const match = PROJECT_OPTIONS.find((opt) => opt.toLowerCase() === raw);
  return match || '';
}
