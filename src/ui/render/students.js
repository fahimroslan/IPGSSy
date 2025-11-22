import { getAllPrograms } from '../../db/repositories/programsRepo.js';
import { getAllStudents } from '../../db/repositories/studentsRepo.js';

const STATUS_BADGES = {
  active: 'bg-emerald-100 text-emerald-700',
  defer: 'bg-amber-100 text-amber-700',
  withdraw: 'bg-red-100 text-red-700',
  suspended: 'bg-red-100 text-red-700'
};

function statusBadgeClass(status) {
  return STATUS_BADGES[status?.toLowerCase()] || 'bg-gray-100 text-gray-600';
}

export async function renderStudents(deps = {}) {
  const {
    loadProgramsIntoSelects,
    refreshStudentProfileIfActive,
    filterText = '',
    selectedStudentId = null,
    skipSync = false
  } = deps;
  const listEl = document.getElementById('students-list');
  const emptyState = document.getElementById('students-empty-state');
  if (!listEl || !emptyState) return;
  listEl.innerHTML = '<div class="py-6 text-center text-gray-400 text-sm">Loading students...</div>';

  const [programs, students] = await Promise.all([
    getAllPrograms(),
    getAllStudents()
  ]);
  const programMap = Object.fromEntries(programs.map(p => [p.id, p.name]));
  const searchTerm = (filterText || '').toString().trim().toLowerCase();
  const items = students
    .slice()
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    .filter(student => {
      if (!searchTerm) return true;
      const haystack = [
        student.name || '',
        student.studentId || '',
        student.email || '',
        student.phone || '',
        programMap[student.programId] || ''
      ].join(' ').toLowerCase();
      return haystack.includes(searchTerm);
    });

  listEl.innerHTML = '';
  if (!items.length){
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  items.forEach((student, index) => {
    const suspended = (student.status || '').toLowerCase() === 'suspended';
    const card = document.createElement('div');
    card.dataset.studentId = student.id;
    card.className = [
      'student-card',
      'cursor-pointer',
      'transition',
      'px-4',
      'py-2',
      'border-b',
      'border-gray-100',
      'flex',
      'items-center',
      'justify-between',
      'gap-3',
      suspended ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'hover:bg-gray-50'
    ].join(' ');
    if (selectedStudentId && student.id === selectedStudentId){
      card.classList.add('ring-2', 'ring-indigo-300');
    }
    card.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-2 w-full items-center text-sm">
        <div class="flex items-center gap-3 lg:col-span-4">
          <span class="text-xs text-gray-400">#${index + 1}</span>
          <span class="font-semibold ${suspended ? 'text-red-700' : ''}">${student.name || '-'}</span>
          <span class="text-xs px-2 py-0.5 rounded-full ${statusBadgeClass(student.status)}">${student.status || 'Active'}</span>
        </div>
        <div class="text-xs font-mono text-gray-500 lg:col-span-2">${student.studentId || '-'}</div>
        <div class="text-xs text-gray-500 lg:col-span-3">${programMap[student.programId] || '-'}</div>
        <div class="text-xs text-gray-500 lg:col-span-1">${student.intake || '-'}</div>
        <div class="flex items-center gap-2 text-xs lg:text-sm justify-end lg:col-span-2">
          <button class="px-3 py-1 rounded bg-gray-100 text-gray-700" data-action="view-profile" data-id="${student.id}">Profile</button>
          <button class="px-3 py-1 rounded bg-blue-600 text-white" data-action="edit-student" data-id="${student.id}">Edit</button>
          <button class="px-3 py-1 rounded bg-red-50 text-red-600" data-action="delete-student" data-id="${student.id}">Delete</button>
        </div>
      </div>
    `;
    listEl.appendChild(card);
  });

  if (!skipSync && typeof loadProgramsIntoSelects === 'function') {
    await loadProgramsIntoSelects();
  }
  if (!skipSync && typeof refreshStudentProfileIfActive === 'function') {
    await refreshStudentProfileIfActive();
  }
}
