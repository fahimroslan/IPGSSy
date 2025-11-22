import { getAllPrograms } from '../../db/repositories/programsRepo.js';
import { getAllStudents } from '../../db/repositories/studentsRepo.js';

export async function renderStudents(deps = {}) {
  const { loadProgramsIntoSelects, refreshStudentProfileIfActive } = deps;
  const tbody = document.getElementById('rows-students');
  if (!tbody) return;
  tbody.innerHTML = '';
  const [programs, students] = await Promise.all([
    getAllPrograms(),
    getAllStudents()
  ]);
  const pmap = Object.fromEntries(programs.map(p => [p.id, p.name]));
  const items = students.slice().sort((a, b) => (b.id || 0) - (a.id || 0));

  items.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="py-2 pr-4">${i+1}</td>
      <td class="py-2 pr-4">${s.studentId || '-'}</td>
      <td class="py-2 pr-4">
        <button class="text-left text-blue-600 hover:underline" data-action="view-profile" data-id="${s.id}">
          ${s.name || ''}
        </button>
      </td>
      <td class="py-2 pr-4">${pmap[s.programId] || '-'}</td>
      <td class="py-2 pr-4">${s.intake || '-'}</td>
      <td class="py-2 pr-4">${s.status || '-'}</td>
      <td class="py-2 pr-4">
        <button class="text-blue-600 underline" data-action="edit-student" data-id="${s.id}">Edit</button>
        <button class="text-red-600 underline ml-2" data-action="delete-student" data-id="${s.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (typeof loadProgramsIntoSelects === 'function') {
    await loadProgramsIntoSelects();
  }
  if (typeof refreshStudentProfileIfActive === 'function') {
    await refreshStudentProfileIfActive();
  }
}
