import { getTodayIso } from '../../utils/dates.js';

// Prefill registration date if blank on load
export function ensureStudentRegistrationDefault() {
  const form = document.getElementById('form-student');
  if (!form) return;
  const input = form.querySelector('input[name="registrationDate"]');
  if (input && !input.value) {
    input.value = getTodayIso();
  }
}
