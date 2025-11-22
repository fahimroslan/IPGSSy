import { db } from './db/db.js';
import { gradeFromMark } from './utils/grades.js';
import { getTodayIso, sanitizeRegistrationDate } from './utils/dates.js';
import { formatMoney, formatAgentCode, formatFeeGroupCode, getAgentTypeLabel } from './utils/formatters.js';
import { PROJECT_OPTIONS, normalizeProjectType } from './utils/projects.js';
import { ensureStudentRegistrationDefault } from './ui/forms/studentFormUtils.js';
import {
  syncStudentCourses,
  assignCourseToStudents,
  deleteCourseCascade,
  deleteProgramCascade,
  ensureStudentCoursesSeeded,
} from './services/studentCoursesService.js';
import {
  getDashboardFinanceSnapshot,
  getPaymentTableView,
  getLedgerOverview,
  calculateInvoiceBalance,
  isInvoiceOverdue,
  formatBalancesLine,
  formatCurrency,
} from './services/ledgerService.js';
import { renderDashboard } from './ui/render/dashboard.js';
import { renderPayments } from './ui/render/payments.js';
import { renderStudents as renderStudentsView } from './ui/render/students.js';
import { renderStudentProfile as renderStudentProfileView } from './ui/render/profile.js';
import { renderLedger as renderLedgerView } from './ui/render/ledger.js';
import {
  exportStudents,
  exportPrograms,
  exportCourses,
  exportResults,
  exportAgents,
  exportFeeGroups,
  exportPayments,
  exportInvoices
} from './services/excelService.js';
import { exportBackupZip, restoreBackupZip } from './services/backupService.js';
    ensureStudentRegistrationDefault();
    const programLookup = new Map();
    const SUSPENDED_STATUS = 'suspended';
    const ACADEMIC_HOLD_STATUSES = new Set(['defer','withdraw','suspended']);
    const isSuspendedStatus = (status) => (status || '').toString().toLowerCase() === SUSPENDED_STATUS;
    const isAcademicHoldStatus = (status) => ACADEMIC_HOLD_STATUSES.has((status || '').toString().toLowerCase());

    let allStudentsCache = [];
    let currentLedgerStudentId = null;
    let currentProfileStudentId = null;


    async function populateResultCourses(studentId){
      const rCourseSel = document.getElementById('result-course');
      if (!rCourseSel) return;
      rCourseSel.innerHTML = '<option value="">Select Course</option>';
      rCourseSel.disabled = !studentId;
      if (!studentId) return;
      const links = await db.studentCourses.where('studentIdFk').equals(Number(studentId)).toArray();
      if (!links.length) return;
      const courseIds = Array.from(new Set(links.map(l => l.courseIdFk)));
      const courses = await db.courses.bulkGet(courseIds);
      const filtered = courses.filter(Boolean).sort((a,b) => (a.code || '').localeCompare(b.code || ''));
      for (const c of filtered){
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.code || ''} â€” ${c.title || ''}`.trim();
        rCourseSel.appendChild(opt);
      }
    }

    // ---------------------- Tabs ----------------------
    const panels = {
      dashboard: document.getElementById('panel-dashboard'),
      students: document.getElementById('panel-students'),
      profile: document.getElementById('panel-profile'),
      programs: document.getElementById('panel-programs'),
      results:  document.getElementById('panel-results'),
      reports:  document.getElementById('panel-reports'),
      finance:  document.getElementById('panel-finance'),
      ledger:   document.getElementById('panel-ledger'),
      import:   document.getElementById('panel-import'),
    };
    document.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(b => {
          b.classList.remove('bg-blue-600', 'text-white');
          b.classList.add('bg-gray-200');
        });
        btn.classList.add('bg-blue-600', 'text-white');
        btn.classList.remove('bg-gray-200');
        const tab = btn.dataset.tab;
        Object.keys(panels).forEach(k => panels[k].classList.toggle('hidden', k !== tab));
        if (tab === 'dashboard'){
          renderDashboard();
        }
      });
    });

    // ---------------------- Loaders ----------------------
    async function loadProgramsIntoSelects(){
      await ensureStudentCoursesSeeded();
      const programs = await db.programs.toArray();
      programLookup.clear();
      programs.forEach(p => {
        if (p && p.id !== undefined){
          programLookup.set(p.id, p);
        }
      });
      const pSel = document.getElementById('student-program');
      const repSel = document.getElementById('report-student');
      const rStuSel = document.getElementById('result-student');
      const feeProgramSel = document.getElementById('fee-program');

      // Programs into student & course forms
      if (pSel){ pSel.innerHTML = '<option value="">Select Program</option>'; }
      if (feeProgramSel){ feeProgramSel.innerHTML = '<option value="">Select Program</option>'; }
      for (const p of programs){
        const programLabel = p.mqaCode ? `${p.name} (${p.mqaCode})` : p.name;
        if (pSel){
          const opt1 = document.createElement('option');
          opt1.value = p.id;
          opt1.textContent = programLabel;
          pSel.appendChild(opt1);
        }
        if (feeProgramSel){
          const opt3 = document.createElement('option');
          opt3.value = p.id;
          opt3.textContent = programLabel;
          feeProgramSel.appendChild(opt3);
        }
      }

      // Students into results & reports selections
      const students = await db.students.toArray();
      allStudentsCache = students.slice();
      if (rStuSel){ rStuSel.innerHTML = '<option value="">Select Student</option>'; }
      if (repSel){ repSel.innerHTML = '<option value="">Select Student</option>'; }
      const paymentStuSel = document.getElementById('payment-student');
      if (paymentStuSel){ paymentStuSel.innerHTML = '<option value="">Select Student</option>'; }
      for (const s of students){
        if (rStuSel){
          const o1 = document.createElement('option');
          o1.value = s.id;
          o1.textContent = s.name;
          rStuSel.appendChild(o1);
        }
        if (repSel){
          const o2 = document.createElement('option');
          o2.value = s.id;
          o2.textContent = s.name;
          repSel.appendChild(o2);
        }
        if (paymentStuSel){
          const o3 = document.createElement('option');
          o3.value = s.id;
          o3.textContent = s.name;
          paymentStuSel.appendChild(o3);
        }
      }

      await populateResultCourses(rStuSel?.value || '');
      await ensureLedgerStudentSelectionValid();
      await ensureProfileSelectionValid();
      const profileSearchInput = document.getElementById('profile-student-search');
      if (profileSearchInput){
        renderProfileSearchResults(profileSearchInput.value || '');
      }
    }

    function getStudentSearchMatches(query){
      const normalized = (query || '').toString().trim().toLowerCase();
      if (!normalized) return allStudentsCache.slice();
      return allStudentsCache.filter(student => {
        if (!student) return false;
        const haystack = [
          student.name || '',
          student.studentId || '',
          student.email || '',
          student.phone || ''
        ].join(' ').toLowerCase();
        return haystack.includes(normalized);
      });
    }

    function programNameForStudent(student){
      if (!student || student.programId === undefined || student.programId === null) return '-';
      const program = programLookup.get(student.programId);
      if (!program) return '-';
      const base = program.name || `Program #${program.id}`;
      return program.mqaCode ? `${base} (${program.mqaCode})` : base;
    }

    function updateProfileSelectionLabel(student){
      const label = document.getElementById('profile-selection-label');
      if (label){
        const suspended = student && isSuspendedStatus(student.status);
        label.textContent = student
          ? `Viewing: ${student.name || 'Unnamed'}${student.studentId ? ` (${student.studentId})` : ''}`
          : 'No student selected.';
        label.classList.toggle('text-red-600', !!suspended);
        label.classList.toggle('text-gray-500', !suspended);
      }
      const clearBtn = document.getElementById('profile-clear-selection');
      if (clearBtn){
        clearBtn.classList.toggle('hidden', !student);
        clearBtn.disabled = !student;
      }
    }

    function updateProfileSearchSelectionHighlight(){
      const rows = document.querySelectorAll('#profile-search-rows tr[data-student-id]');
      rows.forEach(row => {
        const isActive = currentProfileStudentId && Number(row.dataset.studentId) === currentProfileStudentId;
        row.classList.toggle('bg-indigo-50', !!isActive);
        row.classList.toggle('ring-2', !!isActive);
        row.classList.toggle('ring-indigo-200', !!isActive);
      });
    }

    function updateStudentsListSelectionHighlight(){
      const cards = document.querySelectorAll('#students-list [data-student-id]');
      cards.forEach(card => {
        const isActive = currentProfileStudentId && Number(card.dataset.studentId) === currentProfileStudentId;
        card.classList.toggle('ring-2', !!isActive);
        card.classList.toggle('ring-indigo-300', !!isActive);
      });
    }

    async function ensureProfileSelectionValid(){
      if (!currentProfileStudentId){
        updateProfileSelectionLabel(null);
        updateProfileSearchSelectionHighlight();
        updateStudentsListSelectionHighlight();
        return;
      }
      const match = allStudentsCache.find(s => s && s.id === currentProfileStudentId) || null;
      if (!match){
        currentProfileStudentId = null;
        updateProfileSelectionLabel(null);
        updateProfileSearchSelectionHighlight();
        updateStudentsListSelectionHighlight();
        await renderStudentProfile('');
      } else {
        updateProfileSelectionLabel(match);
        updateProfileSearchSelectionHighlight();
        updateStudentsListSelectionHighlight();
      }
    }

    function renderProfileSearchResults(query){
      const rowsEl = document.getElementById('profile-search-rows');
      const container = document.getElementById('profile-search-results');
      const emptyEl = document.getElementById('profile-empty');
      if (!rowsEl || !container || !emptyEl) return;
      const trimmed = (query || '').toString().trim();
      if (!trimmed){
        rowsEl.innerHTML = '';
        container.classList.add('hidden');
        emptyEl.textContent = '';
        updateProfileSearchSelectionHighlight();
        return;
      }
      const matches = getStudentSearchMatches(trimmed);
      if (!matches.length){
        rowsEl.innerHTML = '';
        container.classList.add('hidden');
        emptyEl.textContent = `No students found for "${trimmed}".`;
        return;
      }
      emptyEl.textContent = 'Click a row below to view the student profile.';
      container.classList.remove('hidden');
      rowsEl.innerHTML = '';
      matches.slice(0, 25).forEach(student => {
        const tr = document.createElement('tr');
        tr.dataset.studentId = student.id;
        tr.className = 'cursor-pointer hover:bg-gray-50';
        if (currentProfileStudentId === student.id){
          tr.classList.add('bg-indigo-50');
        }
        tr.innerHTML = `
          <td class="py-2 pr-4 ${isSuspendedStatus(student.status) ? 'text-red-600 font-semibold' : ''}">${student.name || '-'}</td>
          <td class="py-2 pr-4">${student.studentId || '-'}</td>
          <td class="py-2 pr-4">${programNameForStudent(student)}</td>
          <td class="py-2 pr-4">${student.status || '-'}</td>
        `;
        rowsEl.appendChild(tr);
      });
      updateProfileSearchSelectionHighlight();
    }

    async function setCurrentProfileStudent(studentId, meta = {}){
      const numericId = Number(studentId);
      if (!studentId || Number.isNaN(numericId)){
        if (currentProfileStudentId !== null){
          currentProfileStudentId = null;
          updateProfileSelectionLabel(null);
          updateProfileSearchSelectionHighlight();
          await renderStudentProfile('');
        }
        return;
      }
      const student = meta.student || allStudentsCache.find(s => s && s.id === numericId) || null;
      currentProfileStudentId = numericId;
      updateProfileSelectionLabel(student);
      await renderStudentProfile(numericId);
      updateProfileSearchSelectionHighlight();
      updateStudentsListSelectionHighlight();
    }

    function updateLedgerStudentActiveLabel(student){
      const label = document.getElementById('ledger-student-active-label');
      if (label){
        const suspended = student && isSuspendedStatus(student.status);
        label.textContent = student
          ? `Selected: ${student.name || 'Unnamed'}${student.studentId ? ` (${student.studentId})` : ''}`
          : 'No student selected. Click a student row above to load their ledger.';
        label.classList.toggle('text-red-600', !!suspended);
        label.classList.toggle('text-gray-500', !suspended);
      }
      const clearBtn = document.getElementById('ledger-clear-selection');
      if (clearBtn){
        clearBtn.disabled = !student;
      }
    }

    async function ensureLedgerStudentSelectionValid(){
      if (!currentLedgerStudentId) {
        updateLedgerStudentActiveLabel(null);
        updateLedgerOverviewSelectionStyles();
        return;
      }
      const match = allStudentsCache.find(s => s && s.id === currentLedgerStudentId) || null;
      if (!match){
        currentLedgerStudentId = null;
        updateLedgerStudentActiveLabel(null);
        await renderLedger('');
        updateLedgerOverviewSelectionStyles();
      } else {
        updateLedgerStudentActiveLabel(match);
        updateLedgerOverviewSelectionStyles();
      }
    }

    function updateLedgerOverviewSelectionStyles(){
      const rows = document.querySelectorAll('#rows-ledger-overview tr[data-student-id]');
      rows.forEach(row => {
        const isActive = currentLedgerStudentId && Number(row.dataset.studentId) === currentLedgerStudentId;
        row.classList.toggle('ring-2', !!isActive);
        row.classList.toggle('ring-indigo-200', !!isActive);
      });
    }

    async function setCurrentLedgerStudent(studentId, meta = {}){
      const numericId = Number(studentId);
      if (!studentId || Number.isNaN(numericId)){
        if (currentLedgerStudentId !== null){
          currentLedgerStudentId = null;
          selectedLedgerInvoiceId = null;
          updateLedgerStudentActiveLabel(null);
          await renderLedger('');
          updateLedgerOverviewSelectionStyles();
        }
        return;
      }
      const fallback = meta.name ? { id: numericId, name: meta.name, studentId: meta.studentCode || '' } : null;
      const match = allStudentsCache.find(s => s && s.id === numericId) || fallback;
      if (!match){
        return;
      }
      if (currentLedgerStudentId === numericId){
        updateLedgerStudentActiveLabel(match);
        return;
      }
      currentLedgerStudentId = numericId;
      selectedLedgerInvoiceId = null;
      updateLedgerStudentActiveLabel(match);
      await renderLedger(numericId);
      updateLedgerOverviewSelectionStyles();
    }

    const resultStudentSelect = document.getElementById('result-student');
    if (resultStudentSelect){
      resultStudentSelect.addEventListener('change', (ev) => {
        populateResultCourses(ev.target.value);
      });
    }

    async function loadAgentsIntoSelects(){
      const agents = await db.agents.toArray();
      const activeAgents = agents.filter(a => (a.status || 'Active').toLowerCase() !== 'terminated');
      const feeAgentSel = document.getElementById('fee-agent');
      if (feeAgentSel){
        feeAgentSel.innerHTML = '<option value="">Select Agent</option>';
        for (const a of activeAgents){
          const opt = document.createElement('option');
          opt.value = a.id;
          opt.textContent = `${formatAgentCode(a.id)} â€” ${a.name || 'Unnamed'} (${getAgentTypeLabel(a.type)})`;
          feeAgentSel.appendChild(opt);
        }
      }
    }

    async function getNextFeeGroupSequence(agentId){
      if (!agentId) return 1;
      const existing = await db.feeGroups.where('agentId').equals(agentId).toArray();
      if (!existing.length) return 1;
      const maxSeq = existing.reduce((max, fg) => Math.max(max, Number(fg.sequence) || 0), 0);
      return maxSeq + 1;
    }

    async function terminateAgent(agentId, reason){
      if (!agentId) return;
      const trimmedReason = (reason || '').toString().trim();
      const timestamp = new Date().toISOString();
      await db.transaction('rw', db.agents, db.feeGroups, db.students, db.invoices, db.payments, async () => {
        await db.agents.update(agentId, {
          status: 'Terminated',
          terminatedAt: timestamp,
          terminatedReason: trimmedReason
        });
        const linkedFeeGroups = await db.feeGroups.where('agentId').equals(agentId).toArray();
        if (!linkedFeeGroups.length) return;
        const fgIds = linkedFeeGroups.map(fg => fg.id);
        await db.feeGroups.bulkDelete(fgIds);
        await db.students.where('feeGroupId').anyOf(fgIds).modify({ feeGroupId: null });
        await db.invoices.where('feeGroupId').anyOf(fgIds).modify({ feeGroupId: null });
        await db.payments.where('feeGroupId').anyOf(fgIds).modify({ feeGroupId: null });
      });
    }

    async function loadFeeGroupsIntoSelects(){
      const [feeGroups, programs] = await Promise.all([
        db.feeGroups.toArray(),
        db.programs.toArray()
      ]);
      const pmap = Object.fromEntries(programs.map(p=>[p.id,p.name]));
      const paymentFeeSel = document.getElementById('payment-feegroup');
      const stuFeeSel = document.getElementById('student-feegroup');
      if (paymentFeeSel){
        paymentFeeSel.innerHTML = '<option value="">Select Fee Group</option>';
        for (const fg of feeGroups){
          const opt = document.createElement('option');
          opt.value = fg.id;
          const programLabel = pmap[fg.programId] ? ` (${pmap[fg.programId]})` : '';
          opt.textContent = `${formatFeeGroupCode(fg.agentId, fg.sequence)} â€” ${fg.name}${programLabel}`;
          paymentFeeSel.appendChild(opt);
        }
      }
      if (stuFeeSel){
        stuFeeSel.innerHTML = '<option value="">Select Fee Group</option>';
        for (const fg of feeGroups){
          const opt = document.createElement('option');
          opt.value = fg.id;
          const pname = pmap[fg.programId] ? ` (${pmap[fg.programId]})` : '';
          opt.textContent = `${formatFeeGroupCode(fg.agentId, fg.sequence)} â€” ${fg.name}${pname}`;
          stuFeeSel.appendChild(opt);
        }
      }
    }

    async function renderPrograms(){
      const tbody = document.getElementById('rows-programs');
      if (!tbody) return;
      tbody.innerHTML = '';
      const [items, courses] = await Promise.all([
        db.programs.toArray(),
        db.courses.toArray()
      ]);
      const courseCount = courses.reduce((acc, c) => {
        if (!c.programId) return acc;
        acc[c.programId] = (acc[c.programId] || 0) + 1;
        return acc;
      }, {});
      const formatDuration = (raw) => {
        if (raw === undefined || raw === null || raw === '') return '';
        const num = Number(raw);
        if (!Number.isFinite(num)) return raw;
        return `${num} year${num === 1 ? '' : 's'}`;
      };
      items.forEach((p, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="py-2 pr-4">${i+1}</td>
          <td class="py-2 pr-4">${p.name || ''}</td>
          <td class="py-2 pr-4 font-mono text-sm">${p.mqaCode || '-'}</td>
          <td class="py-2 pr-4">${p.level || '-'}</td>
          <td class="py-2 pr-4">${p.mode || ''}</td>
          <td class="py-2 pr-4">${courseCount[p.id] || 0}</td>
          <td class="py-2 pr-4">${p.projectType || '-'}</td>
          <td class="py-2 pr-4">${formatDuration(p.duration)}</td>
          <td class="py-2 pr-4">
            <button class="text-blue-600 underline" data-action="edit-program" data-id="${p.id}">Edit</button>
            <button class="text-red-600 underline ml-2" data-action="delete-program" data-id="${p.id}">Delete</button>
            <button class="text-gray-700 underline ml-2" data-action="toggle-courses" data-id="${p.id}">Courses</button>
          </td>
        `;
        tbody.appendChild(tr);
        const detailTr = document.createElement('tr');
        detailTr.classList.add('hidden');
        detailTr.dataset.detailFor = p.id;
        detailTr.innerHTML = `
          <td colspan="9" class="bg-gray-50 px-4 py-3">
            <div class="text-sm text-gray-600 mb-2">Courses for ${p.name || ''}</div>
            <div data-courses-list="${p.id}" class="text-sm text-gray-700">No courses loaded.</div>
          </td>
        `;
        tbody.appendChild(detailTr);
      });
      await loadProgramsIntoSelects();
      await refreshStudentProfileIfActive();
    }

    async function renderStudents(options = {}){
      const { skipSync = false } = options;
      const searchInput = document.getElementById('students-search');
      await renderStudentsView({
        loadProgramsIntoSelects,
        refreshStudentProfileIfActive,
        filterText: searchInput ? searchInput.value : '',
        selectedStudentId: currentProfileStudentId,
        skipSync
      });
      updateStudentsListSelectionHighlight();
    }

    async function renderCourses(){
      const tbody = document.getElementById('rows-courses');
      if (!tbody){
        await loadProgramsIntoSelects();
        return;
      }
      tbody.innerHTML = '';
      const [items, programs] = await Promise.all([
        db.courses.toArray(),
        db.programs.toArray()
      ]);
      const pmap = Object.fromEntries(programs.map(p => [p.id, p.name]));
      items.forEach((c, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="py-2 pr-4">${i+1}</td>
          <td class="py-2 pr-4">${c.code || ''}</td>
          <td class="py-2 pr-4">${c.title || ''}</td>
          <td class="py-2 pr-4">${c.credit ?? ''}</td>
          <td class="py-2 pr-4">${pmap[c.programId] || '-'}</td>
          <td class="py-2 pr-4">
            <button class="text-blue-600 underline" data-action="edit-course" data-id="${c.id}">Edit</button>
            <button class="text-red-600 underline ml-2" data-action="delete-course" data-id="${c.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      await loadProgramsIntoSelects();
      await refreshStudentProfileIfActive();
    }

    async function renderResults(){
      const tbody = document.getElementById('rows-results');
      if (!tbody) return;
      tbody.innerHTML = '';
      const [students, courses] = await Promise.all([
        db.students.toArray(), db.courses.toArray()
      ]);
      const smap = Object.fromEntries(students.map(s => [s.id, s.name]));
      const cmap = Object.fromEntries(courses.map(c => [c.id, `${c.code} â€” ${c.title}`]));
      const crmap = Object.fromEntries(courses.map(c => [c.id, c.credit]));

      // FIX: use orderBy('id').reverse() instead of table.reverse()
      const items = await db.results.orderBy('id').reverse().toArray();
      items.forEach((r, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="py-2 pr-4">${i+1}</td>
          <td class="py-2 pr-4">${smap[r.studentIdFk] || '-'}</td>
          <td class="py-2 pr-4">${cmap[r.courseIdFk] || '-'}</td>
          <td class="py-2 pr-4">${crmap[r.courseIdFk] ?? '-'}</td>
          <td class="py-2 pr-4">${r.semester || '-'}</td>
          <td class="py-2 pr-4">${r.mark ?? '-'}</td>
          <td class="py-2 pr-4">${r.grade || '-'}</td>
          <td class="py-2 pr-4">${(r.point ?? 0).toFixed?.(2) ?? r.point}</td>
        `;
        tbody.appendChild(tr);
      });
      await refreshStudentProfileIfActive();
    }

    async function renderAgents(){
      const tbody = document.getElementById('rows-agents');
      if (!tbody) return;
      tbody.innerHTML = '';
      const agents = await db.agents.toArray();
      agents.forEach((a, i) => {
        const status = (a.status || 'Active').toString();
        const isTerminated = status.toLowerCase() === 'terminated';
        const typeBadge = (a.type || 'external') === 'internal'
          ? '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Internal Marketing</span>'
          : '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">External Agent</span>';
        const rawLink = (a.agreementLink || '').trim();
        const prefixedLink = rawLink && !/^https?:\/\//i.test(rawLink) ? `https://${rawLink}` : rawLink;
        const safeLink = prefixedLink ? prefixedLink.replace(/"/g, '&quot;') : '';
        const linkCell = safeLink
          ? `<a href="${safeLink}" target="_blank" rel="noopener" class="text-blue-600 underline break-all">Open</a>`
          : '-';
        const statusBadge = isTerminated
          ? '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Terminated</span>'
          : '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Active</span>';
        const tr = document.createElement('tr');
        tr.className = isTerminated ? 'text-gray-500' : '';
        tr.innerHTML = `
          <td class="py-2 pr-4 font-mono">${formatAgentCode(a.id)}</td>
          <td class="py-2 pr-4">${a.name || ''}</td>
          <td class="py-2 pr-4">${typeBadge}</td>
          <td class="py-2 pr-4">${a.email || ''}</td>
          <td class="py-2 pr-4">${a.phone || ''}</td>
          <td class="py-2 pr-4">${linkCell}</td>
          <td class="py-2 pr-4">${a.agreement || ''}</td>
          <td class="py-2 pr-4">${statusBadge}</td>
          <td class="py-2 pr-4 whitespace-nowrap">
            <button class="text-blue-600 underline" data-action="edit-agent" data-id="${a.id}">Edit</button>
            ${isTerminated ? '' : `<button class="text-red-600 underline ml-2" data-action="terminate-agent" data-id="${a.id}">Terminate</button>`}
          </td>
        `;
        tbody.appendChild(tr);
      });
      await loadAgentsIntoSelects();
      await refreshStudentProfileIfActive();
    }

    async function renderFeeGroups(){
      const tbody = document.getElementById('rows-feegroups');
      if (!tbody) return;
      tbody.innerHTML = '';
      const [feeGroups, programs, agents] = await Promise.all([
        db.feeGroups.toArray(), db.programs.toArray(), db.agents.toArray()
      ]);
      const pmap = Object.fromEntries(programs.map(p => [p.id, p.name]));
        const amap = Object.fromEntries(agents.map(a => [a.id, a]));
      feeGroups.forEach((fg, i) => {
        const reg = Number(fg.registrationFee) || 0;
        const tui = Number(fg.tuitionFee) || 0;
        const conv = Number(fg.convocationFee) || 0;
        const total = reg + tui + conv;
        const indexCode = formatFeeGroupCode(fg.agentId, fg.sequence);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="py-2 pr-4">${i+1}</td>
          <td class="py-2 pr-4">${fg.name || ''}</td>
          <td class="py-2 pr-4 font-mono text-sm">${indexCode}</td>
            <td class="py-2 pr-4">${pmap[fg.programId] || '-'}</td>
            <td class="py-2 pr-4">${amap[fg.agentId] ? `${amap[fg.agentId].name || '-'} (${getAgentTypeLabel(amap[fg.agentId].type)})` : '-'}</td>
          <td class="py-2 pr-4">${reg.toFixed(2)}</td>
          <td class="py-2 pr-4">${tui.toFixed(2)}</td>
          <td class="py-2 pr-4">${conv.toFixed(2)}</td>
          <td class="py-2 pr-4 font-semibold">${total.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      });
      await loadFeeGroupsIntoSelects();
      await loadAgentsIntoSelects();
      updateInternalMarketingTemplates(feeGroups, agents, programs);
      await refreshStudentProfileIfActive();
    }

    let internalFeeTemplateMap = new Map();

    function updateInternalMarketingTemplates(feeGroups = [], agents = [], programs = []){
      const select = document.getElementById('fee-internal-template');
      if (!select) return;
      const internalAgentIds = new Set(
        agents
          .filter(a => (a.status || 'Active').toLowerCase() !== 'terminated' && (a.type || 'external') === 'internal')
          .map(a => a.id)
      );
      const pmap = Object.fromEntries(programs.map(p => [p.id, p.name || `Program #${p.id}`]));
      const internalFeeGroups = feeGroups.filter(fg => internalAgentIds.has(fg.agentId));
      internalFeeTemplateMap = new Map(internalFeeGroups.map(fg => [fg.id, fg]));
      select.innerHTML = '<option value="">Copy fees from Internal Marketing</option>';
      select.value = '';
      if (!internalFeeGroups.length){
        select.disabled = true;
        return;
      }
      select.disabled = false;
      internalFeeGroups
        .slice()
        .sort((a,b)=>{
          const nameA = `${pmap[a.programId] || ''} ${a.name || ''}`.trim().toLowerCase();
          const nameB = `${pmap[b.programId] || ''} ${b.name || ''}`.trim().toLowerCase();
          return nameA.localeCompare(nameB);
        })
        .forEach(fg => {
          const opt = document.createElement('option');
          opt.value = fg.id;
          const programLabel = pmap[fg.programId] ? ` (${pmap[fg.programId]})` : '';
          opt.textContent = `${formatFeeGroupCode(fg.agentId, fg.sequence)} â€” ${fg.name || ''}${programLabel}`;
          select.appendChild(opt);
        });
    }

    // renderDashboard moved to src/ui/render/dashboard.js

    // Student profile renderer now lives in src/ui/render/profile.js
    async function renderStudentProfile(studentId){
      await renderStudentProfileView(studentId, (id) => {
        currentProfileStudentId = id || null;
        const match = allStudentsCache.find(s => s && s.id === currentProfileStudentId) || null;
        updateProfileSelectionLabel(match);
        updateProfileSearchSelectionHighlight();
      });
    }

    async function refreshStudentProfileIfActive(){
      if (currentProfileStudentId){
        await renderStudentProfile(currentProfileStudentId);
      }
    }

    function rebuildLedgerFilter(select, options, placeholder, previousValue){
      if (!select) return '';
      const frag = document.createDocumentFragment();
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = placeholder;
      frag.appendChild(defaultOpt);
      let keepPrev = false;
      options.forEach(opt => {
        const optionEl = document.createElement('option');
        optionEl.value = String(opt.value);
        optionEl.textContent = opt.label;
        if (optionEl.value === previousValue) keepPrev = true;
        frag.appendChild(optionEl);
      });
      select.innerHTML = '';
      select.appendChild(frag);
      const nextValue = keepPrev ? previousValue : '';
      select.value = nextValue;
      return select.value;
    }

    async function renderLedgerOverview(){
      const programSelect = document.getElementById('ledger-filter-program');
      const agentSelect = document.getElementById('ledger-filter-agent');
      const studentSearchInput = document.getElementById('ledger-filter-student-search');
      const tableBody = document.getElementById('rows-ledger-overview');
      const emptyEl = document.getElementById('ledger-overview-empty');
      const cards = {
        billed: document.getElementById('ledger-card-billed'),
        billedNote: document.getElementById('ledger-card-billed-note'),
        collected: document.getElementById('ledger-card-collected'),
        collectedNote: document.getElementById('ledger-card-collected-note'),
        pending: document.getElementById('ledger-card-pending'),
        pendingNote: document.getElementById('ledger-card-pending-note'),
        overdue: document.getElementById('ledger-card-overdue'),
        overdueNote: document.getElementById('ledger-card-overdue-note'),
        discountSummary: document.getElementById('ledger-discount-summary')
      };
      if (!programSelect || !agentSelect || !tableBody || !emptyEl) return;

      const [students, programs, agents, feeGroups, invoices, rawPayments] = await Promise.all([
        db.students.toArray(),
        db.programs.toArray(),
        db.agents.toArray(),
        db.feeGroups.toArray(),
        db.invoices.toArray(),
        db.payments.toArray()
      ]);

      const payments = rawPayments.filter(p => !p.deleted);
      const programMap = new Map(programs.map(p => [p.id, p]));
      const agentMap = new Map(agents.map(a => [a.id, a]));
      const feeGroupMap = new Map(feeGroups.map(fg => [fg.id, fg]));

      const programOptions = programs
        .map(p => {
          const base = p.name || `Program #${p.id}`;
          const label = p.mqaCode ? `${base} (${p.mqaCode})` : base;
          return { value: p.id, label };
        })
        .sort((a,b)=>a.label.localeCompare(b.label));
      const agentOptions = agents
        .map(a => ({
          value: String(a.id),
          label: `${formatAgentCode(a.id)} — ${a.name || `Agent #${a.id}`} (${getAgentTypeLabel(a.type)})`
        }))
        .sort((a,b)=>a.label.localeCompare(b.label));

      const prevProgram = programSelect.value;
      const prevAgent = agentSelect.value;

      const currentProgram = rebuildLedgerFilter(programSelect, programOptions, 'All Programs', prevProgram);
      const currentAgent = rebuildLedgerFilter(agentSelect, agentOptions, 'All Agents', prevAgent);

      const studentQuery = (studentSearchInput?.value || '').toString().trim().toLowerCase();

      const filters = {
        program: currentProgram,
        agent: currentAgent,
        studentText: studentQuery
      };

      const filteredStudents = students.filter(student => {
        const matchesProgram = !filters.program || String(student.programId || '') === filters.program;
        const fg = student.feeGroupId ? feeGroupMap.get(student.feeGroupId) : null;
        const agentId = fg?.agentId ? String(fg.agentId) : '';
        const matchesAgent = !filters.agent || agentId === filters.agent;
        const matchesStudent = !filters.studentText || [
          student.name || '',
          student.studentId || '',
          student.email || '',
          student.phone || ''
        ].join(' ').toLowerCase().includes(filters.studentText);
        return matchesProgram && matchesAgent && matchesStudent;
      });

      tableBody.innerHTML = '';
      if (!filteredStudents.length){
        emptyEl.classList.remove('hidden');
        if (cards.billed) cards.billed.textContent = '-';
        if (cards.collected) cards.collected.textContent = '-';
        if (cards.pending) cards.pending.textContent = '-';
        if (cards.overdue) cards.overdue.textContent = '-';
        if (cards.discountSummary) cards.discountSummary.textContent = 'Discounts Granted: RM 0.00';
        return;
      }
      emptyEl.classList.add('hidden');

      const rows = filteredStudents
        .map((student, idx) => {
          const invs = invoices.filter(inv => inv.studentIdFk === student.id);
          const billed = invs.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
          const collected = invs.reduce((sum, inv) => sum + Math.min(Number(inv.paid) || 0, Number(inv.amount) || 0), 0);
          const pending = invs.reduce((sum, inv) => sum + calculateInvoiceBalance(inv), 0);
          const overdue = invs.reduce((sum, inv) => sum + (isInvoiceOverdue(inv) ? calculateInvoiceBalance(inv) : 0), 0);
          const discounts = payments
            .filter(p => p.studentIdFk === student.id && (p.type || '').toLowerCase() === 'discount')
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
          const fg = student.feeGroupId ? feeGroupMap.get(student.feeGroupId) : null;
          const agent = fg?.agentId ? agentMap.get(fg.agentId) : null;
          const invoiceCount = invs.length;
          const status = invoiceCount
            ? invs.every(inv => calculateInvoiceBalance(inv) <= 0) ? 'Paid'
              : invs.some(inv => inv.paid > 0) ? 'Partial'
              : 'Open'
            : 'Open';
          return {
            index: idx + 1,
            student,
            invoiceCount,
            billed,
            collected,
            pending,
            overdue,
            discounts,
            fg,
            agent,
            status
          };
        })
        .sort((a,b)=>a.student.name.localeCompare(b.student.name));

      const totals = rows.reduce((acc,row)=>{
        acc.billed += row.billed;
        acc.collected += row.collected;
        acc.pending += row.pending;
        acc.overdue += row.overdue;
        acc.discounts += row.discounts;
        return acc;
      }, { billed:0, collected:0, pending:0, overdue:0, discounts:0 });

      rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.dataset.studentId = row.student.id;
        tr.dataset.studentName = row.student.name || '';
        tr.dataset.studentCode = row.student.studentId || '';
        const suspended = isSuspendedStatus(row.student.status);
        const hasOverdue = row.overdue > 0;
        tr.className = `cursor-pointer transition ${
          suspended
            ? 'bg-red-50 hover:bg-red-100 text-red-700'
            : hasOverdue
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
              : 'hover:bg-gray-50'
        }`;
        tr.innerHTML = `
          <td class="py-2 pr-4">${row.index}</td>
          <td class="py-2 pr-4 ${suspended ? 'text-red-600 font-semibold' : ''}">${row.student.name || '-'}</td>
          <td class="py-2 pr-4">${row.student.studentId || '-'}</td>
          <td class="py-2 pr-4">${row.student.programId ? (programMap.get(row.student.programId)?.name || '-') : '-'}</td>
          <td class="py-2 pr-4">${row.agent ? `${row.agent.name || '-'} (${formatAgentCode(row.agent.id)})` : '-'}</td>
          <td class="py-2 pr-4">${row.invoiceCount}</td>
          <td class="py-2 pr-4">${formatMoney(row.billed)}</td>
          <td class="py-2 pr-4">${formatMoney(row.collected)}</td>
          <td class="py-2 pr-4 text-emerald-600">${row.discounts ? formatMoney(row.discounts) : '-'}</td>
          <td class="py-2 pr-4">${formatMoney(row.pending)}</td>
          <td class="py-2 pr-4">${formatMoney(row.overdue)}</td>
          <td class="py-2 pr-4 text-sm text-gray-700">${row.status}</td>
        `;
        tableBody.appendChild(tr);
      });

      const totalsRow = document.getElementById('ledger-overview-totals');
      if (totalsRow){
        totalsRow.innerHTML = `
          <td class="py-2 pr-4 font-semibold" colspan="5">Totals</td>
          <td class="py-2 pr-4 font-semibold">${rows.reduce((sum, r)=>sum + r.invoiceCount, 0)}</td>
          <td class="py-2 pr-4 font-semibold">${formatMoney(totals.billed)}</td>
          <td class="py-2 pr-4 font-semibold">${formatMoney(totals.collected)}</td>
          <td class="py-2 pr-4 font-semibold text-emerald-600">${totals.discounts ? formatMoney(totals.discounts) : '-'}</td>
          <td class="py-2 pr-4 font-semibold">${formatMoney(totals.pending)}</td>
          <td class="py-2 pr-4 font-semibold">${formatMoney(totals.overdue)}</td>
          <td class="py-2 pr-4 font-semibold text-sm text-gray-600">-</td>
        `;
      }

      if (cards.billed) cards.billed.textContent = formatCurrency(totals.billed);
      if (cards.collected) cards.collected.textContent = formatCurrency(totals.collected);
      if (cards.pending) cards.pending.textContent = formatCurrency(totals.pending);
      if (cards.overdue) cards.overdue.textContent = formatCurrency(totals.overdue);
      if (cards.billedNote) cards.billedNote.textContent = `${rows.length} students, ${rows.reduce((sum,r)=>sum+r.invoiceCount,0)} invoices`;
      if (cards.collectedNote) cards.collectedNote.textContent = totals.billed ? `${((totals.collected / totals.billed) * 100).toFixed(1)}% collected` : 'No invoices';
      if (cards.pendingNote) cards.pendingNote.textContent = totals.pending ? 'Outstanding balance' : 'No pending invoices';
      if (cards.overdueNote) cards.overdueNote.textContent = totals.overdue ? 'Overdue amounts present' : 'No overdue invoices';
      if (cards.discountSummary) cards.discountSummary.textContent = `Discounts Granted: RM ${formatMoney(totals.discounts)}`;
      updateLedgerOverviewSelectionStyles();
    }
    async function ensureInvoicesForFeeGroup(studentId, feeGroupId){
      if (!studentId || !feeGroupId) return;
      const student = await db.students.get(Number(studentId));
      const paymentPlan = student?.paymentPlan || 'lump';
      const registrationDate = student?.registrationDate || new Date().toISOString().slice(0,10);
      let startDate = new Date(registrationDate || new Date());
      if (isNaN(startDate.getTime())){
        startDate = new Date();
      }
      const feeGroup = await db.feeGroups.get(Number(feeGroupId));
      if (!feeGroup) return;
      const existing = await db.invoices.where({studentIdFk:Number(studentId), feeGroupId:Number(feeGroupId)}).toArray();
      const has = (type)=>existing.some(inv => inv.feeType === type);
      const existingTuition = existing.filter(inv => (inv.feeType||'').toString().startsWith('tuition'));
      const today = new Date().toISOString().slice(0,10);
      const baseItems = [
        {type:'registration', amount:Number(feeGroup.registrationFee)||0},
        {type:'convocation', amount:Number(feeGroup.convocationFee)||0},
      ];
      // Add non-tuition items
      for (const it of baseItems){
        if (it.amount <= 0) continue;
        if (has(it.type)) continue;
        await db.invoices.add({
          studentIdFk: Number(studentId),
          feeGroupId: Number(feeGroupId),
          feeType: it.type,
          amount: it.amount,
          paid: 0,
          status: 'open',
          createdAt: startDate.toISOString().slice(0,10)
        });
      }
      // Tuition handling based on payment plan
      const tuitionAmt = Number(feeGroup.tuitionFee)||0;
      if (tuitionAmt <= 0) return;

      const desiredParts = paymentPlan === 'installment12' ? 12 : (paymentPlan === 'installment6' ? 6 : 1);
      const existingParts = existingTuition.length || 0;
      const existingHasPayments = existingTuition.length
        ? (await db.payments.where('invoiceIdFk').anyOf(existingTuition.map(t=>t.id)).toArray()).some(p => !p.deleted)
        : false;

      // If tuition invoices already match desired and exist, keep them
      if (existingParts === desiredParts && existingParts > 0) return;

      // If mismatch but payments exist, avoid destructive changes
      if (existingHasPayments) return;

      // Remove old tuition invoices when we can
      if (existingTuition.length){
        await db.invoices.bulkDelete(existingTuition.map(t=>t.id));
      }

      const addMonths = (d, n)=>{
        const dt = new Date(d.getTime());
        dt.setMonth(dt.getMonth() + n);
        return dt.toISOString().slice(0,10);
      };

      if (desiredParts === 1){
        await db.invoices.add({
          studentIdFk: Number(studentId),
          feeGroupId: Number(feeGroupId),
          feeType: 'tuition',
          amount: tuitionAmt,
          paid: 0,
          status: 'open',
          createdAt: startDate.toISOString().slice(0,10)
        });
      } else {
        const parts = desiredParts;
        const slice = Math.round((tuitionAmt / parts) * 100) / 100;
        let remaining = tuitionAmt;
        for (let i=1;i<=parts;i++){
          const amount = i === parts ? Math.round(remaining * 100) / 100 : slice;
          remaining = Math.round((remaining - amount) * 100) / 100;
          await db.invoices.add({
            studentIdFk: Number(studentId),
            feeGroupId: Number(feeGroupId),
            feeType: `tuition-${i}/${parts}`,
            amount: amount,
            paid: 0,
            status: 'open',
            createdAt: addMonths(startDate, i-1)
          });
        }
      }
    }

    async function adjustInvoicesForRegistrationDate(studentId, registrationDate){
      if (!studentId) return;
      const normalized = sanitizeRegistrationDate(registrationDate);
      let baseDate = new Date(normalized);
      if (isNaN(baseDate.getTime())){
        baseDate = new Date();
      }
      const invoices = await db.invoices.where('studentIdFk').equals(Number(studentId)).toArray();
      if (!invoices.length) return;
      const updates = [];
      const baseTypes = ['registration','convocation'];
      invoices.forEach(inv => {
        const type = (inv.feeType || '').toString().toLowerCase();
        if (baseTypes.includes(type)){
          updates.push({ id: inv.id, createdAt: normalized });
        }
      });
      const tuitionInvoices = invoices.filter(inv => {
        const type = (inv.feeType || '').toString().toLowerCase();
        return type === 'tuition' || type.startsWith('tuition-');
      });
      if (tuitionInvoices.length){
        const getOrder = (inv) => {
          const fee = (inv.feeType || '').toString().toLowerCase();
          if (fee === 'tuition') return 0;
          const match = fee.match(/^tuition-(\d+)\/(\d+)/);
          if (match) return parseInt(match[1], 10) || 0;
          return 0;
        };
        tuitionInvoices.sort((a,b)=>{
          const diff = getOrder(a) - getOrder(b);
          if (diff !== 0) return diff;
          return (a.createdAt || '').localeCompare(b.createdAt || '');
        });
        tuitionInvoices.forEach((inv, idx) => {
          const dt = new Date(baseDate.getTime());
          dt.setMonth(dt.getMonth() + idx);
          updates.push({ id: inv.id, createdAt: dt.toISOString().slice(0,10) });
        });
      }
      await Promise.all(updates.map(row => db.invoices.update(row.id, { createdAt: row.createdAt })));
    }

    function statusFromPaid(amount, paid){
      const bal = (Number(amount)||0) - (Number(paid)||0);
      if (bal <= 0) return 'paid';
      if (bal < amount) return 'partial';
      return 'open';
    }

    async function recomputeInvoicesForStudent(studentId){
      const invoices = await db.invoices.where('studentIdFk').equals(Number(studentId)).toArray();
      const payments = (await db.payments.where('studentIdFk').equals(Number(studentId)).toArray()).filter(p => !p.deleted);
      const paidMap = {};
      for (const p of payments){
        if (!p.invoiceIdFk) continue;
        if (p.type === 'debit') continue; // debit is a charge creation, not a payment
        paidMap[p.invoiceIdFk] = (paidMap[p.invoiceIdFk] || 0) + (Number(p.amount)||0);
      }
      for (const inv of invoices){
        const paid = paidMap[inv.id] || 0;
        const status = statusFromPaid(Number(inv.amount)||0, paid);
        await db.invoices.update(inv.id, { paid, status });
      }
    }

    async function updateLedgerPayment({paymentId, studentId, invoiceId, type, amount, note, date, reason}){
      const payment = await db.payments.get(Number(paymentId));
      if (!payment) throw new Error('Payment not found.');
      if (payment.studentIdFk !== Number(studentId)) throw new Error('Payment does not belong to this student.');

      const cleanReason = (reason || '').toString().trim();
      const cleanNote = (note || '').toString().trim();
      let targetInvoiceId = invoiceId ? Number(invoiceId) : (payment.invoiceIdFk || null);

      if ((type === 'credit' || type === 'discount') && !targetInvoiceId){
        throw new Error('Select an invoice to apply the payment/discount.');
      }

      // For manual charges (debit), also keep the backing invoice in sync
      if (type === 'debit' && payment.invoiceIdFk){
        await db.invoices.update(payment.invoiceIdFk, {
          amount: amount,
          createdAt: date || payment.date || new Date().toISOString().slice(0,10)
        });
        targetInvoiceId = payment.invoiceIdFk;
      }

      await db.payments.update(paymentId, {
        invoiceIdFk: targetInvoiceId,
        type,
        amount,
        note: cleanNote,
        date: date || payment.date,
        lastChangeReason: cleanReason,
        deleted: false
      });

      await recomputeInvoicesForStudent(studentId);
    }

    async function deleteLedgerPayment(paymentId){
      const payment = await db.payments.get(Number(paymentId));
      if (!payment) return;
      const reason = prompt('Enter a reason for removing this payment:');
      if (!reason || !reason.toString().trim()) return alert('Reason is required to remove a payment.');
      const trimmed = reason.toString().trim();

      // If removing a charge (debit) ensure no other payments are tied to that invoice
      if (payment.type === 'debit' && payment.invoiceIdFk){
        const siblingPayments = (await db.payments.where({invoiceIdFk: payment.invoiceIdFk}).toArray()).filter(p => p.id !== payment.id && !p.deleted);
        if (siblingPayments.length){
          return alert('Remove payments applied to this charge before deleting it.');
        }
        await db.invoices.delete(payment.invoiceIdFk);
      }

      await db.payments.update(paymentId, { deleted: true, lastChangeReason: trimmed });
      await recomputeInvoicesForStudent(payment.studentIdFk);
    }

    async function applyPaymentToInvoice({studentId, invoiceId, type, amount, note, date}){
      const invoice = await db.invoices.get(Number(invoiceId));
      if (!invoice || invoice.studentIdFk !== Number(studentId)) throw new Error('Invalid invoice selection');
      const amt = Number(amount) || 0;
      if (type === 'debit'){
        // Treat as manual charge by creating a new invoice instead
        const manualId = await db.invoices.add({
          studentIdFk: Number(studentId),
          feeGroupId: invoice.feeGroupId,
          feeType: 'manual',
          amount: amt,
          paid: 0,
          status: 'open',
          createdAt: date || new Date().toISOString().slice(0,10)
        });
        await db.payments.add({
          studentIdFk: Number(studentId),
          feeGroupId: invoice.feeGroupId || null,
          invoiceIdFk: manualId,
          type: 'debit',
          amount: amt,
          note,
          date: date || new Date().toISOString().slice(0,10),
          lastChangeReason: ''
        });
        return;
      }
      const newPaid = Math.min((Number(invoice.paid)||0) + amt, Number(invoice.amount)||0);
      const status = statusFromPaid(Number(invoice.amount)||0, newPaid);
      await db.invoices.update(invoice.id, { paid: newPaid, status });
      await db.payments.add({
        studentIdFk: Number(studentId),
        feeGroupId: invoice.feeGroupId || null,
        invoiceIdFk: invoice.id,
        type,
        amount: amt,
        note,
        date: date || new Date().toISOString().slice(0,10),
        lastChangeReason: ''
      });
    }

    const selectedLedgerInvoiceRef = { current: null };
    const setSelectedInvoiceId = (id) => {
      selectedLedgerInvoiceId = id;
      selectedLedgerInvoiceRef.current = id;
    };
    // Ledger renderer now lives in src/ui/render/ledger.js
    async function renderLedger(studentId){
      selectedLedgerInvoiceRef.current = selectedLedgerInvoiceId;
      await renderLedgerView(studentId, ensureInvoicesForFeeGroup, setSelectedInvoiceId, selectedLedgerInvoiceRef);
    }

    // ---------------------- GPA Helpers ----------------------
    async function computeGPABySemester(studentId){
      const results = await db.results.where('studentIdFk').equals(Number(studentId)).toArray();
      const bySem = {};
      for (const r of results){
        const credit = Number(r.credit) || 0;
        const qp = (Number(r.point) || 0) * credit; // quality points
        if (!bySem[r.semester]) bySem[r.semester] = {credits: 0, qp: 0, rows: []};
        bySem[r.semester].credits += credit;
        bySem[r.semester].qp += qp;
        bySem[r.semester].rows.push(r);
      }
      const semesters = Object.keys(bySem).sort();
      const view = semesters.map(sem => {
        const d = bySem[sem];
        const gpa = d.credits > 0 ? d.qp / d.credits : 0;
        return { semester: sem, credits: d.credits, qp: d.qp, gpa: gpa };
      });
      const totalCredits = view.reduce((a,b)=>a+b.credits,0);
      const totalQP = view.reduce((a,b)=>a+b.qp,0);
      const cgpa = totalCredits > 0 ? totalQP / totalCredits : 0;
      return { semesters: view, cgpa, detail: bySem };
    }

    // ---------------------- Forms ----------------------
    let editingProgramId = null;
    const programSubmitBtn = document.getElementById('program-submit');
    const programCancelBtn = document.getElementById('program-cancel-edit');
    const programEditingLabel = document.getElementById('program-editing-label');

    function setProgramFormMode(editing){
      if (!programSubmitBtn || !programCancelBtn || !programEditingLabel) return;
      if (editing){
        programSubmitBtn.textContent = 'Update Program';
        programCancelBtn.classList.remove('hidden');
        programEditingLabel.classList.remove('hidden');
      } else {
        programSubmitBtn.textContent = 'Save Program';
        programCancelBtn.classList.add('hidden');
        programEditingLabel.classList.add('hidden');
      }
    }
    setProgramFormMode(false);

    if (programCancelBtn){
      programCancelBtn.addEventListener('click', () => {
        editingProgramId = null;
        const form = document.getElementById('form-program');
        form.reset();
        setProgramFormMode(false);
        resetProgramCourseDrafts();
      });
    }

    let programCourseDrafts = [];
    let programCourseDraftEditingKey = null;
    let programCourseDraftCounter = 1;
    const programCourseCodeInput = document.getElementById('program-course-code');
    const programCourseTitleInput = document.getElementById('program-course-title');
    const programCourseCreditInput = document.getElementById('program-course-credit');
    const programCourseAddBtn = document.getElementById('program-course-add');
    const programCourseCancelBtn = document.getElementById('program-course-cancel');
    const programCourseEditingLabel = document.getElementById('program-course-editing-label');

    function setProgramCourseDraftFormMode(editing){
      if (!programCourseAddBtn || !programCourseCancelBtn || !programCourseEditingLabel) return;
      if (editing){
        programCourseAddBtn.textContent = 'Update Course';
        programCourseCancelBtn.classList.remove('hidden');
        programCourseEditingLabel.classList.remove('hidden');
      } else {
        programCourseAddBtn.textContent = 'Add Course';
        programCourseCancelBtn.classList.add('hidden');
        programCourseEditingLabel.classList.add('hidden');
      }
    }

    function resetProgramCourseDraftForm(){
      if (programCourseCodeInput) programCourseCodeInput.value = '';
      if (programCourseTitleInput) programCourseTitleInput.value = '';
      if (programCourseCreditInput) programCourseCreditInput.value = '';
      programCourseDraftEditingKey = null;
      setProgramCourseDraftFormMode(false);
    }

    function renderProgramCourseDrafts(){
      const tbody = document.getElementById('program-course-drafts');
      if (!tbody) return;
      if (!programCourseDrafts.length){
        tbody.innerHTML = `<tr><td colspan="5" class="py-3 px-2 text-center text-gray-500">No courses added yet.</td></tr>`;
        return;
      }
      tbody.innerHTML = '';
      programCourseDrafts.forEach((c, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="py-2 px-2">${idx + 1}</td>
          <td class="py-2 px-2">${c.code || ''}</td>
          <td class="py-2 px-2">${c.title || ''}</td>
          <td class="py-2 px-2">${c.credit ?? ''}</td>
          <td class="py-2 px-2">
            <button type="button" class="text-blue-600 underline text-xs" data-action="edit-draft-course" data-key="${c.key}">Edit</button>
            <button type="button" class="text-red-600 underline text-xs ml-2" data-action="delete-draft-course" data-key="${c.key}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function resetProgramCourseDrafts(){
      programCourseDrafts = [];
      programCourseDraftEditingKey = null;
      resetProgramCourseDraftForm();
      renderProgramCourseDrafts();
    }

    async function loadProgramCoursesIntoDrafts(programId){
      const courses = programId ? await db.courses.where('programId').equals(programId).toArray() : [];
      programCourseDrafts = courses.map(c => ({
        key: `existing-${c.id}`,
        id: c.id,
        code: c.code || '',
        title: c.title || '',
        credit: c.credit ?? ''
      }));
      programCourseDraftEditingKey = null;
      resetProgramCourseDraftForm();
      renderProgramCourseDrafts();
    }

    function upsertProgramCourseDraft(entry){
      if (programCourseDraftEditingKey){
        const idx = programCourseDrafts.findIndex(d => d.key === programCourseDraftEditingKey);
        if (idx >= 0){
          programCourseDrafts[idx] = { ...programCourseDrafts[idx], ...entry };
        }
      } else {
        programCourseDrafts.push({
          key: `draft-${Date.now()}-${programCourseDraftCounter++}`,
          ...entry
        });
      }
      programCourseDraftEditingKey = null;
      resetProgramCourseDraftForm();
      renderProgramCourseDrafts();
    }

    if (programCourseAddBtn){
      programCourseAddBtn.addEventListener('click', () => {
        const code = programCourseCodeInput?.value.trim();
        const title = programCourseTitleInput?.value.trim();
        const creditRaw = programCourseCreditInput?.value;
        if (!code || !title) return alert('Course code and title are required');
        const credit = creditRaw === '' || creditRaw === undefined ? '' : Number(creditRaw);
        const existing = programCourseDraftEditingKey ? programCourseDrafts.find(d => d.key === programCourseDraftEditingKey) : null;
        upsertProgramCourseDraft({
          key: existing?.key,
          id: existing?.id,
          code,
          title,
          credit: credit === '' || Number.isNaN(credit) ? '' : credit
        });
      });
    }

    if (programCourseCancelBtn){
      programCourseCancelBtn.addEventListener('click', () => {
        programCourseDraftEditingKey = null;
        resetProgramCourseDraftForm();
      });
    }

    const programCourseDraftTable = document.getElementById('program-course-drafts');
    if (programCourseDraftTable){
      programCourseDraftTable.addEventListener('click', (ev) => {
        const btn = ev.target instanceof HTMLElement ? ev.target.closest('button[data-action]') : null;
        if (!btn) return;
        const action = btn.dataset.action;
        const key = btn.dataset.key;
        if (!action || !key) return;
        if (action === 'edit-draft-course'){
          const entry = programCourseDrafts.find(c => c.key === key);
          if (!entry) return;
          if (programCourseCodeInput) programCourseCodeInput.value = entry.code || '';
          if (programCourseTitleInput) programCourseTitleInput.value = entry.title || '';
          if (programCourseCreditInput) programCourseCreditInput.value = entry.credit === '' || entry.credit === null || entry.credit === undefined ? '' : entry.credit;
          programCourseDraftEditingKey = entry.key;
          setProgramCourseDraftFormMode(true);
        } else if (action === 'delete-draft-course'){
          programCourseDrafts = programCourseDrafts.filter(c => c.key !== key);
          if (programCourseDraftEditingKey === key){
            programCourseDraftEditingKey = null;
            resetProgramCourseDraftForm();
          }
          renderProgramCourseDrafts();
        }
      });
    }

    resetProgramCourseDrafts();

    async function persistProgramCourses(programId){
      const existing = await db.courses.where('programId').equals(programId).toArray();
      const keptIds = new Set();
      for (const draft of programCourseDrafts){
        const rawCredit = draft.credit === '' || draft.credit === null || draft.credit === undefined ? 0 : Number(draft.credit);
        const credit = Number.isFinite(rawCredit) ? rawCredit : 0;
        if (draft.id){
          keptIds.add(draft.id);
          await db.courses.update(draft.id, {
            code: draft.code,
            title: draft.title,
            credit,
            programId
          });
          await db.results.where('courseIdFk').equals(draft.id).modify({ credit });
        } else {
          const newId = await db.courses.add({
            code: draft.code,
            title: draft.title,
            credit,
            programId
          });
          await assignCourseToStudents(newId, programId);
        }
      }
      const toDelete = existing.filter(c => !keptIds.has(c.id));
      for (const course of toDelete){
        await deleteCourseCascade(course.id);
      }
    }

    async function renderProgramCourseList(container, programId){
      if (!container) return;
      container.textContent = 'Loading coursesâ€¦';
      const courses = await db.courses.where('programId').equals(programId).toArray();
      if (!courses.length){
        container.textContent = 'No courses registered for this program.';
        return;
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'overflow-x-auto';
      const table = document.createElement('table');
      table.className = 'min-w-full text-xs border rounded bg-white';
      table.innerHTML = `
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="py-1 px-2 border-b">#</th>
            <th class="py-1 px-2 border-b">Code</th>
            <th class="py-1 px-2 border-b">Title</th>
            <th class="py-1 px-2 border-b">Credit</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      const tbody = table.querySelector('tbody');
      courses.forEach((c, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="py-1 px-2 border-b">${idx + 1}</td>
          <td class="py-1 px-2 border-b">${c.code || ''}</td>
          <td class="py-1 px-2 border-b">${c.title || ''}</td>
          <td class="py-1 px-2 border-b">${c.credit ?? ''}</td>
        `;
        tbody.appendChild(tr);
      });
      wrapper.appendChild(table);
      container.innerHTML = '';
      container.appendChild(wrapper);
    }

    document.getElementById('form-program').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      const mqaCode = (data.mqaCode || '').toString().trim().toUpperCase();
      if (!mqaCode) return alert('MQA approval number is required.');
      const duplicate = await db.programs.where('mqaCode').equals(mqaCode).first();
      if (duplicate && duplicate.id !== editingProgramId){
        return alert('This MQA approval number is already registered to another program.');
      }
      const durationYears = data.duration ? Number(data.duration) : null;
      const projectType = normalizeProjectType(data.projectType) || PROJECT_OPTIONS[0];
      const level = (data.level || '').toString().trim() || 'Master';
      const payload = {
        name: data.name?.trim(),
        mqaCode,
        level,
        mode: data.mode?.trim(),
        projectType,
        duration: Number.isFinite(durationYears) ? durationYears : null
      };
      if (editingProgramId){
        await db.programs.update(editingProgramId, payload);
        await persistProgramCourses(editingProgramId);
        editingProgramId = null;
        setProgramFormMode(false);
        alert('Program updated.');
      } else {
        const newId = await db.programs.add(payload);
        await persistProgramCourses(newId);
        alert('Program saved.');
      }
      e.target.reset();
      resetProgramCourseDrafts();
      await renderPrograms();
      await renderCourses();
      const selectedStudent = document.getElementById('result-student')?.value || '';
      await populateResultCourses(selectedStudent);
    });

    let editingStudentId = null;
    const studentSubmitBtn = document.getElementById('student-submit');
    const studentCancelBtn = document.getElementById('student-cancel-edit');
    const studentEditingLabel = document.getElementById('student-editing-label');

    function setStudentFormMode(editing){
      if (!studentSubmitBtn || !studentCancelBtn || !studentEditingLabel) return;
      if (editing){
        studentSubmitBtn.textContent = 'Update Student';
        studentCancelBtn.classList.remove('hidden');
        studentEditingLabel.classList.remove('hidden');
      } else {
        studentSubmitBtn.textContent = 'Save Student';
        studentCancelBtn.classList.add('hidden');
        studentEditingLabel.classList.add('hidden');
      }
    }
    setStudentFormMode(false);

    let editingLedgerPaymentId = null;
    let selectedLedgerInvoiceId = null;
    const ledgerPaymentSubmitBtn = document.getElementById('ledger-payment-submit');
    const ledgerPaymentCancelBtn = document.getElementById('ledger-payment-cancel');
    const ledgerPaymentEditingLabel = document.getElementById('ledger-payment-editing-label');
    function setLedgerPaymentFormMode(editing){
      if (!ledgerPaymentSubmitBtn || !ledgerPaymentCancelBtn || !ledgerPaymentEditingLabel) return;
      if (editing){
        ledgerPaymentSubmitBtn.textContent = 'Update Payment';
        ledgerPaymentCancelBtn.classList.remove('hidden');
        ledgerPaymentEditingLabel.classList.remove('hidden');
      } else {
        ledgerPaymentSubmitBtn.textContent = 'Save Payment';
        ledgerPaymentCancelBtn.classList.add('hidden');
        ledgerPaymentEditingLabel.classList.add('hidden');
        const form = document.getElementById('form-ledger-payment');
        if (form){
          const amountInput = form.querySelector('input[name=\"amount\"]');
          const dateInput = form.querySelector('input[name=\"date\"]');
          if (selectedLedgerInvoiceId){
            const cachedRow = document.querySelector(`tr[data-invoice-id=\"${selectedLedgerInvoiceId}\"]`);
            if (cachedRow && amountInput){
              const balanceCell = cachedRow.children[5]?.textContent || '';
              const numeric = Number(balanceCell.replace(/[^0-9.-]/g,'')) || 0;
              amountInput.value = numeric ? numeric.toFixed(2) : '';
            }
          }
          if (dateInput){
            dateInput.value = new Date().toISOString().slice(0,10);
          }
        }
      }
    }
    setLedgerPaymentFormMode(false);

    if (ledgerPaymentCancelBtn){
      ledgerPaymentCancelBtn.addEventListener('click', ()=>{
        const form = document.getElementById('form-ledger-payment');
        if (form) form.reset();
        editingLedgerPaymentId = null;
        setLedgerPaymentFormMode(false);
      });
    }

    document.getElementById('form-student').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      if (!data.name) return alert('Name is required');
      const normalizedReg = sanitizeRegistrationDate(data.registrationDate);
      const existingStudent = editingStudentId ? await db.students.get(editingStudentId) : null;
      const payload = {
        studentId: data.studentId?.trim() || undefined,
        name: data.name.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
        registrationDate: normalizedReg,
        intake: data.intake?.trim(),
        programId: data.programId ? Number(data.programId) : null,
        feeGroupId: data.feeGroupId ? Number(data.feeGroupId) : null,
        paymentPlan: data.paymentPlan || 'lump',
        status: data.status || 'Active'
      };
      if (editingStudentId){
        await db.students.update(editingStudentId, payload);
        if (payload.feeGroupId){
          await ensureInvoicesForFeeGroup(editingStudentId, payload.feeGroupId);
        }
        if (existingStudent && existingStudent.registrationDate !== normalizedReg){
          await adjustInvoicesForRegistrationDate(editingStudentId, normalizedReg);
        }
        await syncStudentCourses(editingStudentId, payload.programId);
        alert('Student updated.');
      } else {
        const newId = await db.students.add(payload);
        if (payload.feeGroupId){
          await ensureInvoicesForFeeGroup(newId, payload.feeGroupId);
          await adjustInvoicesForRegistrationDate(newId, normalizedReg);
        }
        await syncStudentCourses(newId, payload.programId);
        alert('Student saved.');
      }
      editingStudentId = null;
      setStudentFormMode(false);
      e.target.reset();
      ensureStudentRegistrationDefault();
      await renderStudents();
      await loadProgramsIntoSelects();
      await renderLedgerOverview();
    });

    if (studentCancelBtn){
      studentCancelBtn.addEventListener('click', () => {
        editingStudentId = null;
        setStudentFormMode(false);
        document.getElementById('form-student').reset();
        ensureStudentRegistrationDefault();
      });
    }


    const programTable = document.getElementById('tbl-programs');
    if (programTable){
      programTable.addEventListener('click', async (ev) => {
        const target = ev.target;
        if (!(target instanceof HTMLElement)) return;
        const action = target.dataset.action;
        const id = target.dataset.id ? Number(target.dataset.id) : null;
        if (!action || !id) return;
        if (action === 'edit-program'){
          const record = await db.programs.get(id);
          if (!record) return;
          const form = document.getElementById('form-program');
          form.elements['name'].value = record.name || '';
          form.elements['mqaCode'].value = record.mqaCode || '';
          form.elements['level'].value = record.level || '';
          form.elements['mode'].value = record.mode || '';
          form.elements['projectType'].value = record.projectType || '';
          form.elements['duration'].value = record.duration ?? '';
          await loadProgramCoursesIntoDrafts(id);
          editingProgramId = id;
          setProgramFormMode(true);
          window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        } else if (action === 'toggle-courses'){
          const detailRow = document.querySelector(`tr[data-detail-for="${id}"]`);
          if (!detailRow) return;
          const currentlyHidden = detailRow.classList.contains('hidden');
          document.querySelectorAll('tr[data-detail-for]').forEach(row => row.classList.add('hidden'));
          if (currentlyHidden){
            detailRow.classList.remove('hidden');
            const container = detailRow.querySelector(`[data-courses-list="${id}"]`);
            await renderProgramCourseList(container, id);
          }
        } else if (action === 'delete-program'){
          const confirmDel = confirm('Delete this program? This removes its courses and unlinks affected students/results.');
          if (!confirmDel) return;
          await deleteProgramCascade(id);
          if (editingProgramId === id){
            editingProgramId = null;
            const form = document.getElementById('form-program');
            form.reset();
            setProgramFormMode(false);
            resetProgramCourseDrafts();
          }
          await renderPrograms();
          await renderCourses();
          await renderStudents();
          await renderResults();
          await renderFeeGroups();
          const selectedStudent = document.getElementById('result-student')?.value || '';
          await populateResultCourses(selectedStudent);
          alert('Program deleted.');
        }
      });
    }

    // Student table actions (edit/delete)
    const studentsListEl = document.getElementById('students-list');
    if (studentsListEl){
      studentsListEl.addEventListener('click', async (ev) => {
        const target = ev.target;
        if (!(target instanceof HTMLElement)) return;
        const actionBtn = target.closest('button[data-action]');
        if (actionBtn){
          const action = actionBtn.dataset.action;
          const id = actionBtn.dataset.id ? Number(actionBtn.dataset.id) : null;
          if (!action || !id) return;
          if (action === 'view-profile'){
            const studentRecord = await db.students.get(id);
            const searchInput = document.getElementById('profile-student-search');
            if (searchInput && studentRecord){
              searchInput.value = studentRecord.name || studentRecord.studentId || '';
              renderProfileSearchResults(searchInput.value);
            }
            await setCurrentProfileStudent(id, { student: studentRecord });
            const profileTabBtn = document.querySelector('.tab[data-tab="profile"]');
            if (profileTabBtn){
              profileTabBtn.click();
            }
            return;
          }
          if (action === 'edit-student'){
            const s = await db.students.get(id);
            if (!s) return;
            await loadProgramsIntoSelects();
            const form = document.getElementById('form-student');
            form.elements['studentId'].value = s.studentId || '';
            form.elements['name'].value = s.name || '';
            form.elements['email'].value = s.email || '';
            form.elements['phone'].value = s.phone || '';
            form.elements['registrationDate'].value = s.registrationDate || '';
            form.elements['intake'].value = s.intake || '';
            form.elements['programId'].value = s.programId || '';
            form.elements['feeGroupId'].value = s.feeGroupId || '';
            form.elements['paymentPlan'].value = s.paymentPlan || 'lump';
            form.elements['status'].value = s.status || 'Active';
            editingStudentId = id;
            setStudentFormMode(true);
            window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
          } else if (action === 'delete-student'){
            const confirmDel = confirm('Delete this student and related invoices/payments/results?');
            if (!confirmDel) return;
            await db.transaction('rw', db.students, db.results, db.payments, db.invoices, db.studentCourses, async () => {
              await db.students.delete(id);
              await db.results.where('studentIdFk').equals(id).delete();
              await db.payments.where('studentIdFk').equals(id).delete();
              await db.invoices.where('studentIdFk').equals(id).delete();
              await db.studentCourses.where('studentIdFk').equals(id).delete();
            });
            if (currentLedgerStudentId === id){
              currentLedgerStudentId = null;
              selectedLedgerInvoiceId = null;
              updateLedgerStudentActiveLabel(null);
              await renderLedger('');
              updateLedgerOverviewSelectionStyles();
            }
            if (currentProfileStudentId === id){
              currentProfileStudentId = null;
              updateProfileSelectionLabel(null);
              updateProfileSearchSelectionHighlight();
              await renderStudentProfile('');
            }
            editingStudentId = null;
            setStudentFormMode(false);
            document.getElementById('form-student').reset();
            ensureStudentRegistrationDefault();
            await renderStudents();
            await renderResults();
            await renderPayments(renderLedgerOverview);
            await renderLedgerOverview();
            alert('Student deleted.');
          }
          return;
        }

        const card = target.closest('[data-student-id]');
        if (card){
          const id = Number(card.dataset.studentId);
          if (!Number.isFinite(id)) return;
          const studentRecord = await db.students.get(id);
          await setCurrentProfileStudent(id, { student: studentRecord });
          const profileTabBtn = document.querySelector('.tab[data-tab="profile"]');
          if (profileTabBtn){
            profileTabBtn.click();
          }
        }
      });
    }

    // Live grade preview when typing mark
    const formResult = document.getElementById('form-result');
    const markInput = formResult.querySelector('input[name="mark"]');
    const preview = document.getElementById('result-preview');
    markInput.addEventListener('input', () => {
      const m = Number(markInput.value);
      const g = gradeFromMark(m);
      preview.textContent = isNaN(m) ? '' : `Grade Preview: ${g.grade}, Point ${g.point.toFixed(2)}`;
    });

    document.getElementById('form-result').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      if (!data.studentId || !data.courseId) return alert('Select student and course');
      const course = await db.courses.get(Number(data.courseId));
      const credit = Number(course?.credit) || 0;
      const m = Number(data.mark);
      const g = gradeFromMark(m);
      await db.results.add({
        studentIdFk: Number(data.studentId),
        courseIdFk: Number(data.courseId),
        semester: data.semester.trim(),
        mark: m,
        grade: g.grade,
        point: g.point,
        credit: credit
      });
      e.target.reset();
      preview.textContent = '';
      await renderResults();
      alert('Result saved.');
    });

    document.getElementById('refresh-programs').addEventListener('click', renderPrograms);
    const refreshStudentsBtn = document.getElementById('refresh-students');
    if (refreshStudentsBtn){
      refreshStudentsBtn.addEventListener('click', () => renderStudents());
    }
    document.getElementById('refresh-results').addEventListener('click', renderResults);

    let editingAgentId = null;
    const agentSubmitBtn = document.getElementById('agent-submit');
    const agentCancelBtn = document.getElementById('agent-cancel-edit');
    const agentEditingLabel = document.getElementById('agent-editing-label');

    function setAgentFormMode(editing){
      if (!agentSubmitBtn || !agentCancelBtn || !agentEditingLabel) return;
      if (editing){
        agentSubmitBtn.textContent = 'Update Agent';
        agentCancelBtn.classList.remove('hidden');
        agentEditingLabel.classList.remove('hidden');
      } else {
        agentSubmitBtn.textContent = 'Save Agent';
        agentCancelBtn.classList.add('hidden');
        agentEditingLabel.classList.add('hidden');
      }
    }
    setAgentFormMode(false);

    if (agentCancelBtn){
      agentCancelBtn.addEventListener('click', () => {
        editingAgentId = null;
        setAgentFormMode(false);
        document.getElementById('form-agent')?.reset();
      });
    }

    document.getElementById('form-agent').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      const name = (data.name || '').toString().trim();
      if (!name) return alert('Agent name is required');
      const rawType = (data.type || 'external').toString().trim().toLowerCase();
      const type = rawType === 'internal' ? 'internal' : 'external';
      const payload = {
        name,
        email: (data.email || '').toString().trim(),
        phone: (data.phone || '').toString().trim(),
        agreement: (data.agreement || '').toString().trim(),
        agreementLink: (data.agreementLink || '').toString().trim(),
        type
      };
      const isEditingAgent = !!editingAgentId;
      if (isEditingAgent){
        await db.agents.update(editingAgentId, payload);
      } else {
        await db.agents.add({
          ...payload,
          status: 'Active',
          terminatedAt: '',
          terminatedReason: ''
        });
      }
      e.target.reset();
      editingAgentId = null;
      setAgentFormMode(false);
      await renderAgents();
      await renderFeeGroups();
      await loadFeeGroupsIntoSelects();
      await renderLedgerOverview();
      alert(isEditingAgent ? 'Agent updated.' : 'Agent saved.');
    });

    const agentTable = document.getElementById('tbl-agents');
    if (agentTable){
      agentTable.addEventListener('click', async (ev) => {
        const target = ev.target;
        if (!(target instanceof HTMLElement)) return;
        const action = target.dataset.action;
        const id = target.dataset.id ? Number(target.dataset.id) : null;
        if (!action || !id) return;
        if (action === 'edit-agent'){
          const record = await db.agents.get(id);
          if (!record) return;
          const form = document.getElementById('form-agent');
          if (!form) return;
          form.elements['name'].value = record.name || '';
          form.elements['email'].value = record.email || '';
          form.elements['phone'].value = record.phone || '';
          form.elements['agreementLink'].value = record.agreementLink || '';
          form.elements['agreement'].value = record.agreement || '';
          if (form.elements['type']){
            form.elements['type'].value = record.type === 'internal' ? 'internal' : 'external';
          }
          editingAgentId = id;
          setAgentFormMode(true);
          window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }
        if (action === 'terminate-agent'){
          const confirmTerm = confirm('Terminate this agent? All linked fee groups will be deleted.');
          if (!confirmTerm) return;
          const reason = prompt('Optional: provide a reason for termination') || '';
          try {
            await terminateAgent(id, reason.trim());
            if (editingAgentId === id){
              editingAgentId = null;
              setAgentFormMode(false);
              document.getElementById('form-agent')?.reset();
            }
            await renderAgents();
            await renderFeeGroups();
            await loadFeeGroupsIntoSelects();
            await loadAgentsIntoSelects();
            await renderLedgerOverview();
            alert('Agent terminated and related fee groups removed.');
          } catch (err){
            console.error(err);
            alert(err.message || 'Unable to terminate agent.');
          }
        }
      });
    }

    document.getElementById('form-feegroup').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      if (!data.name || !data.programId || !data.agentId){
        return alert('Fee group name, program, and agent are required.');
      }
      const agentId = Number(data.agentId);
      const programId = Number(data.programId);
      const sequence = await getNextFeeGroupSequence(agentId);
      await db.feeGroups.add({
        name: data.name.trim(),
        programId,
        agentId,
        sequence,
        registrationFee: Number(data.registrationFee) || 0,
        tuitionFee: Number(data.tuitionFee) || 0,
        convocationFee: Number(data.convocationFee) || 0
      });
      e.target.reset();
      await renderFeeGroups();
      await renderLedgerOverview();
      alert('Fee group saved.');
    });

    const internalTemplateSelect = document.getElementById('fee-internal-template');
    if (internalTemplateSelect){
      internalTemplateSelect.addEventListener('change', () => {
        const templateId = Number(internalTemplateSelect.value);
        if (!templateId) return;
        const template = internalFeeTemplateMap.get(templateId);
        if (!template) return;
        const form = document.getElementById('form-feegroup');
        if (!form) return;
        const toInputValue = (value) => {
          const num = Number(value || 0);
          return Number.isFinite(num) ? num.toString() : '0';
        };
        if (form.elements['registrationFee']){
          form.elements['registrationFee'].value = toInputValue(template.registrationFee);
        }
        if (form.elements['tuitionFee']){
          form.elements['tuitionFee'].value = toInputValue(template.tuitionFee);
        }
        if (form.elements['convocationFee']){
          form.elements['convocationFee'].value = toInputValue(template.convocationFee);
        }
        if (form.elements['programId'] && !form.elements['programId'].value && template.programId){
          form.elements['programId'].value = template.programId;
        }
      });
    }

    const formPayment = document.getElementById('form-payment');
    if (formPayment){
      formPayment.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());
        if (!data.studentId) return alert('Please select a student.');
        if (!data.amount) return alert('Amount is required.');
        const amount = Number(data.amount);
        if (isNaN(amount) || amount < 0) return alert('Amount must be a positive number.');
        const type = (data.type || 'debit').toString().toLowerCase();
        const date = data.date || new Date().toISOString().slice(0,10);
        await db.payments.add({
          studentIdFk: Number(data.studentId),
          feeGroupId: data.feeGroupId ? Number(data.feeGroupId) : null,
          type,
          amount,
          note: (data.note || '').toString().trim(),
          date,
          lastChangeReason: ''
        });
        e.target.reset();
        await renderPayments(renderLedgerOverview);
        await renderLedgerOverview();
        alert('Payment record saved.');
      });
    }

    const ledgerFilterIds = ['ledger-filter-program','ledger-filter-agent'];
    ledgerFilterIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', () => {
        renderLedgerOverview();
      });
    });
    const ledgerFilterSearchInput = document.getElementById('ledger-filter-student-search');
    if (ledgerFilterSearchInput){
      ledgerFilterSearchInput.addEventListener('input', () => {
        renderLedgerOverview();
      });
    }
    const ledgerResetBtn = document.getElementById('ledger-filter-reset');
    if (ledgerResetBtn){
      ledgerResetBtn.addEventListener('click', () => {
        ledgerFilterIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
        if (ledgerFilterSearchInput){
          ledgerFilterSearchInput.value = '';
        }
        renderLedgerOverview();
      });
    }

    const ledgerOverviewRowsEl = document.getElementById('rows-ledger-overview');
    if (ledgerOverviewRowsEl){
      ledgerOverviewRowsEl.addEventListener('click', async (e) => {
        const row = e.target.closest('tr[data-student-id]');
        if (!row) return;
        const sid = Number(row.dataset.studentId);
        const meta = {
          name: row.dataset.studentName || '',
          studentCode: row.dataset.studentCode || ''
        };
        await setCurrentLedgerStudent(sid, meta);
      });
    }
    const ledgerClearSelectionBtn = document.getElementById('ledger-clear-selection');
    if (ledgerClearSelectionBtn){
      ledgerClearSelectionBtn.addEventListener('click', async () => {
        await setCurrentLedgerStudent(null);
      });
    }

    // Ledger: payment table actions (edit/remove)
    const ledgerInvoiceRows = document.getElementById('rows-ledger-invoices');
    if (ledgerInvoiceRows){
      ledgerInvoiceRows.addEventListener('click', async (e) => {
        const row = e.target.closest('tr[data-invoice-id]');
        if (!row) return;
        selectedLedgerInvoiceId = row.dataset.invoiceId ? Number(row.dataset.invoiceId) : null;
        if (currentLedgerStudentId){
          await renderLedger(currentLedgerStudentId);
        }
      });
    }

    const ledgerPaymentRows = document.getElementById('rows-ledger-payments');
    if (ledgerPaymentRows){
      ledgerPaymentRows.addEventListener('click', async (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        const pid = target.dataset?.id ? Number(target.dataset.id) : null;
        if (!pid) return;

        if (target.classList.contains('btn-payment-edit')){
          const payment = await db.payments.get(pid);
          if (!payment || payment.deleted) return;
          selectedLedgerInvoiceId = payment.invoiceIdFk || null;
          if (currentLedgerStudentId){
            await renderLedger(currentLedgerStudentId);
          }
          const form = document.getElementById('form-ledger-payment');
          if (form){
            form.type.value = payment.type || 'credit';
            form.amount.value = payment.amount || '';
            form.date.value = payment.date || '';
            form.note.value = payment.note || '';
          }
          editingLedgerPaymentId = pid;
          setLedgerPaymentFormMode(true);
        }

        if (target.classList.contains('btn-payment-delete')){
          await deleteLedgerPayment(pid);
          editingLedgerPaymentId = null;
          setLedgerPaymentFormMode(false);
          if (currentLedgerStudentId){
            await renderLedger(currentLedgerStudentId);
            await renderPayments(renderLedgerOverview);
            await renderLedgerOverview();
          }
          await refreshStudentProfileIfActive();
        }
      });
    }

    const profileSearchInput = document.getElementById('profile-student-search');
    if (profileSearchInput){
      profileSearchInput.addEventListener('input', (e) => {
        renderProfileSearchResults(e.target.value || '');
      });
    }
    const profileSearchRows = document.getElementById('profile-search-rows');
    if (profileSearchRows){
      profileSearchRows.addEventListener('click', async (e) => {
        const row = e.target.closest('tr[data-student-id]');
        if (!row) return;
        await setCurrentProfileStudent(Number(row.dataset.studentId));
      });
    }
    const profileClearBtn = document.getElementById('profile-clear-selection');
    if (profileClearBtn){
      profileClearBtn.addEventListener('click', async () => {
        const input = document.getElementById('profile-student-search');
        if (input) input.value = '';
        await setCurrentProfileStudent(null);
        renderProfileSearchResults('');
      });
    }

    const studentsSearchInput = document.getElementById('students-search');
    if (studentsSearchInput){
      studentsSearchInput.addEventListener('input', () => {
        renderStudents({ skipSync: true });
      });
    }
    const profileStatusSaveBtn = document.getElementById('profile-status-save');
    const profileStatusSelect = document.getElementById('profile-status-select');
    if (profileStatusSaveBtn && profileStatusSelect){
      profileStatusSaveBtn.addEventListener('click', async () => {
        if (!currentProfileStudentId) return alert('Select a student first.');
        const newStatus = profileStatusSelect.value;
        try {
          await db.students.update(currentProfileStudentId, { status: newStatus });
          const cacheIndex = allStudentsCache.findIndex(s => s && s.id === currentProfileStudentId);
          if (cacheIndex !== -1){
            allStudentsCache[cacheIndex] = {
              ...allStudentsCache[cacheIndex],
              status: newStatus
            };
          }
          const sharedTasks = [
            renderStudentProfile(currentProfileStudentId),
            renderStudents(),
            renderLedgerOverview(),
            renderDashboard()
          ];
          if (currentLedgerStudentId === currentProfileStudentId){
            sharedTasks.push(renderLedger(currentLedgerStudentId));
          }
          await Promise.all(sharedTasks);

          const searchInput = document.getElementById('profile-student-search');
          if (searchInput){
            renderProfileSearchResults(searchInput.value || '');
          }
          alert('Student status updated.');
        } catch (err){
          console.error(err);
          alert(err.message || 'Unable to update status.');
        }
      });
    }

    // Ledger: manual charge shortcut
    const btnAddCharge = document.getElementById('ledger-add-charge');
    if (btnAddCharge){
      btnAddCharge.addEventListener('click', async ()=>{
        const sid = currentLedgerStudentId;
        if (!sid) return alert('Select a student from the ledger list first.');
        const amountStr = prompt('Enter charge amount:');
        if (!amountStr) return;
        const amt = Number(amountStr);
        if (isNaN(amt) || amt <= 0) return alert('Invalid amount.');
        const feeType = prompt('Enter fee label (e.g., Misc, Penalty):', 'manual') || 'manual';
        const feeGroupId = (await db.students.get(Number(sid)))?.feeGroupId || null;
        const today = new Date().toISOString().slice(0,10);
        await db.invoices.add({
          studentIdFk: Number(sid),
          feeGroupId,
          feeType: feeType.toString().toLowerCase(),
          amount: amt,
          paid: 0,
          status: 'open',
          createdAt: today
        });
        await renderLedger(sid);
        await renderLedgerOverview();
        alert('Charge added.');
      });
    }

    // Ledger: payment apply / edit
    document.getElementById('form-ledger-payment').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      const sid = currentLedgerStudentId;
      if (!sid) return alert('Select a student from the ledger list first.');
      const amount = Number(data.amount);
      if (isNaN(amount) || amount <= 0) return alert('Amount must be positive.');
      const type = data.type || 'credit';
      const invoiceId = selectedLedgerInvoiceId ? Number(selectedLedgerInvoiceId) : null;
      if ((type === 'credit' || type === 'discount') && !invoiceId && !editingLedgerPaymentId){
        return alert('Select an invoice to apply the payment/discount.');
      }

      const isEditing = !!editingLedgerPaymentId;
      let editReason = '';
      if (isEditing){
        editReason = prompt('Enter a reason for editing this payment:') || '';
        editReason = editReason.trim();
        if (!editReason) return alert('Reason is required to edit a payment.');
      }

      try {
        if (isEditing){
          await updateLedgerPayment({
            paymentId: editingLedgerPaymentId,
            studentId: Number(sid),
            invoiceId,
            type,
            amount,
            note: (data.note || '').toString().trim(),
            date: data.date,
            reason: editReason
          });
        } else if (type === 'debit' && !invoiceId){
          // create a new manual charge invoice
          const feeGroupId = (await db.students.get(Number(sid)))?.feeGroupId || null;
          const today = data.date || new Date().toISOString().slice(0,10);
          const newInvId = await db.invoices.add({
            studentIdFk: Number(sid),
            feeGroupId,
            feeType: 'manual',
            amount: amount,
            paid: 0,
            status: 'open',
            createdAt: today
          });
          await db.payments.add({
            studentIdFk: Number(sid),
            feeGroupId,
            invoiceIdFk: newInvId,
            type: 'debit',
            amount,
            note: (data.note || '').toString().trim(),
            date: today,
            lastChangeReason: ''
          });
          selectedLedgerInvoiceId = newInvId;
        } else {
          await applyPaymentToInvoice({
            studentId: Number(sid),
            invoiceId,
            type,
            amount,
            note: (data.note || '').toString().trim(),
            date: data.date
          });
        }
      } catch (err){
        console.error(err);
        alert(err.message || 'Unable to apply payment.');
        return;
      }

      e.target.reset();
      editingLedgerPaymentId = null;
      setLedgerPaymentFormMode(false);
      await renderLedger(sid);
      await renderPayments(renderLedgerOverview);
      await renderLedgerOverview();
      alert(isEditing ? 'Payment updated.' : 'Saved.');
    });

    // ---------------------- Reports ----------------------
    document.getElementById('btn-show-report').addEventListener('click', async () => {
      const sel = document.getElementById('report-student');
      const sid = sel.value;
      if (!sid) return alert('Please select a student');
      const student = await db.students.get(Number(sid));
      const { semesters, cgpa, detail } = await computeGPABySemester(Number(sid));

      const summary = document.getElementById('summary-box');
      const reportContainer = document.getElementById('report-container');

      if (!semesters.length){
        summary.innerHTML = `
          <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div><span class="text-gray-500">Name</span><div class="font-medium">${student?.name || '-'}</div></div>
            <div><span class="text-gray-500">Program</span><div class="font-medium" id="summary-program">-</div></div>
            <div><span class="text-gray-500">Intake</span><div class="font-medium">${student?.intake || '-'}</div></div>
            <div><span class="text-gray-500">CGPA</span><div class="font-medium">0.00</div></div>
          </div>
          <p class="mt-2 text-sm text-gray-500">No results recorded yet for this student.</p>
        `;
        if (student?.programId){
          const p = await db.programs.get(student.programId);
          document.getElementById('summary-program').textContent = p?.name || '-';
        }
        reportContainer.innerHTML = '<p class="text-sm text-gray-500">No semester results to display.</p>';
        return;
      }

      // Summary box (with results)
      summary.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div>
            <span class="text-gray-500">Name</span>
            <div class="font-medium">${student?.name || '-'}</div>
          </div>
          <div>
            <span class="text-gray-500">Program</span>
            <div id="summary-program" class="font-medium">-</div>
          </div>
          <div>
            <span class="text-gray-500">Intake</span>
            <div class="font-medium">${student?.intake || '-'}</div>
          </div>
          <div>
            <span class="text-gray-500">CGPA</span>
            <div class="font-medium">${cgpa.toFixed(2)}</div>
          </div>
        </div>`;
      // Program name lookup
      if (student?.programId){
        const p = await db.programs.get(student.programId);
        document.getElementById('summary-program').textContent = p?.name || '-';
      }

      // Results by semester
      const wrap = reportContainer;
      wrap.innerHTML = '';
      const courses = await db.courses.toArray();
      const cmap = Object.fromEntries(courses.map(c => [c.id, c]));

      const semKeys = semesters.map(s=>s.semester);
      for (const sem of semKeys){
        const d = detail[sem];
        const gpa = d.credits > 0 ? (d.qp / d.credits) : 0;
        const card = document.createElement('div');
        card.innerHTML = `
          <div class="mb-2 text-sm text-gray-600">Semester: <span class="font-medium">${sem}</span></div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr>
                  <th class="py-2 pr-4 text-left border-b">#</th>
                  <th class="py-2 pr-4 text-left border-b">Course</th>
                  <th class="py-2 pr-4 text-left border-b">Credit</th>
                  <th class="py-2 pr-4 text-left border-b">Mark</th>
                  <th class="py-2 pr-4 text-left border-b">Grade</th>
                  <th class="py-2 pr-4 text-left border-b">Point</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="mt-2 text-sm">
            Semester Credits: <span class="font-medium">${d.credits}</span>
            Â· GPA: <span class="font-medium">${gpa.toFixed(2)}</span>
          </div>
        `;
        const tbody = card.querySelector('tbody');
        d.rows.forEach((r, i) => {
          const c = cmap[r.courseIdFk];
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="py-2 pr-4">${i+1}</td>
            <td class="py-2 pr-4">${c ? `${c.code} â€” ${c.title}` : '-'}</td>
            <td class="py-2 pr-4">${r.credit ?? '-'}</td>
            <td class="py-2 pr-4">${r.mark ?? '-'}</td>
            <td class="py-2 pr-4">${r.grade ?? '-'}</td>
            <td class="py-2 pr-4">${(r.point ?? 0).toFixed(2)}</td>
          `;
          tbody.appendChild(tr);
        });
        wrap.appendChild(card);
      }
    });

    // ---------------------- IMPORT (Excel) ----------------------
    async function handleImportExcel(file){
      const status = document.getElementById('import-status');
      status.textContent = 'Importingâ€¦';
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, {type:'array'});

      function sheet(name){
        const desired = wb.SheetNames.find(n => n.toLowerCase() === name.toLowerCase());
        return desired ? wb.Sheets[desired] : null;
      }

      const wsStu = sheet('Students');
      if (!wsStu){
        status.textContent = 'Only the "Students" sheet can be imported.';
        return;
      }

      const rows = XLSX.utils.sheet_to_json(wsStu, {defval:''});
      const programRecords = await db.programs.toArray();
      const pmapByName = Object.fromEntries(programRecords.map(p=>[(p.name || '').toString().trim(), p.id]));
      const pmapByMqa = Object.fromEntries(programRecords.map(p=>[(p.mqaCode || '').toString().trim().toUpperCase(), p.id]));
      const feeGroupRecords = await db.feeGroups.toArray();
      const fgmapByName = Object.fromEntries(feeGroupRecords.map(fg=>[(fg.name || '').toString().trim(), fg.id]));
      const fgmapByCode = Object.fromEntries(feeGroupRecords.map(fg=>[formatFeeGroupCode(fg.agentId, fg.sequence).toUpperCase(), fg.id]));
      let addedStudents = 0;

      for (const r of rows){
        const name = (r.name || '').toString().trim();
        if (!name) continue;

        const studentId = (r.studentId || '').toString().trim();
        let existing = null;
        if (studentId){
          existing = await db.students.where('studentId').equals(studentId).first();
        }

        const programName = (r.program || '').toString().trim();
        const programMqa = (r.programMqa || r.programCode || r.mqaCode || '').toString().trim().toUpperCase();
        let programId = null;
        if (programMqa && pmapByMqa[programMqa]){
          programId = pmapByMqa[programMqa];
        } else if (programName && pmapByName[programName]){
          programId = pmapByName[programName];
        }
        const feeGroupCodeKey = (r.feeGroupCode || r.fgCode || '').toString().trim().toUpperCase();
        const feeGroupNameKey = (r.feeGroup || '').toString().trim();
        let feeGroupId = null;
        if (feeGroupCodeKey && fgmapByCode[feeGroupCodeKey]){
          feeGroupId = fgmapByCode[feeGroupCodeKey];
        } else if (feeGroupNameKey){
          feeGroupId = fgmapByName[feeGroupNameKey] || null;
        }
        const paymentPlan = (r.paymentPlan || '').toString().trim() || 'lump';
        const registrationDate = sanitizeRegistrationDate((r.registrationDate || '').toString().trim());

        if (!existing){
          const newId = await db.students.add({
            studentId: studentId || undefined,
            name: name,
            email: (r.email || '').toString().trim(),
            phone: (r.phone || '').toString().trim(),
            intake: (r.intake || '').toString().trim(),
            programId,
            feeGroupId,
            paymentPlan,
            registrationDate,
            status: (r.status || 'Active').toString().trim() || 'Active'
          });
          addedStudents++;
          if (feeGroupId){
            await ensureInvoicesForFeeGroup(newId, feeGroupId);
            await adjustInvoicesForRegistrationDate(newId, registrationDate);
          }
          await syncStudentCourses(newId, programId);
        }
      }

      const importInput = document.getElementById('import-file');
      if (importInput) importInput.value = '';
      status.textContent = addedStudents
        ? `Imported ${addedStudents} student${addedStudents === 1 ? '' : 's'}.`
        : 'No new students were imported.';

      await Promise.all([
        renderStudents(),
        loadProgramsIntoSelects(),
        renderLedgerOverview()
      ]);
    }

    // ---------------------- BACKUP (ZIP) ----------------------
    async function resetAllData(){
      const first = confirm('This will DELETE all data stored in this browser. Continue?');
      if (!first) return;
      const second = confirm('Are you absolutely sure? This action cannot be undone.');
      if (!second) return;
      await db.transaction('rw',
        db.programs,
        db.students,
        db.courses,
        db.results,
        db.agents,
        db.feeGroups,
        db.payments,
        db.invoices,
        db.studentCourses,
        async () => {
          await Promise.all([
            db.programs.clear(),
            db.students.clear(),
            db.courses.clear(),
            db.results.clear(),
            db.agents.clear(),
            db.feeGroups.clear(),
            db.payments.clear(),
            db.invoices.clear(),
            db.studentCourses.clear()
          ]);
        }
      );
      const restoreStatus = document.getElementById('restore-status');
      if (restoreStatus){
        restoreStatus.textContent = 'Database reset at ' + new Date().toLocaleTimeString();
      }
      ensureStudentRegistrationDefault();
      await Promise.all([
        renderPrograms(),
        renderStudents(),
        renderCourses(),
        renderResults(),
        renderAgents(),
        renderFeeGroups(),
        renderPayments(renderLedgerOverview),
        renderLedgerOverview(),
        renderDashboard(),
        loadProgramsIntoSelects()
      ]);
      alert('All data has been cleared from this browser.');
    }

    // ---------------------- Button wiring ----------------------
    document.getElementById('export-students').addEventListener('click', exportStudents);
    document.getElementById('export-programs').addEventListener('click', exportPrograms);
    document.getElementById('export-courses').addEventListener('click', exportCourses);
    document.getElementById('export-results').addEventListener('click', exportResults);
    document.getElementById('export-agents').addEventListener('click', exportAgents);
    document.getElementById('export-feegroups').addEventListener('click', exportFeeGroups);
    document.getElementById('export-payments').addEventListener('click', exportPayments);
    document.getElementById('export-invoices').addEventListener('click', exportInvoices);

    document.getElementById('btn-import').addEventListener('click', async () => {
      const f = document.getElementById('import-file').files[0];
      if (!f) return alert('Choose an Excel file first.');
      await handleImportExcel(f);
    });

    document.getElementById('btn-backup').addEventListener('click', exportBackupZip);
    const backupTopBtn = document.getElementById('btn-backup-top');
    if (backupTopBtn){
      backupTopBtn.addEventListener('click', exportBackupZip);
    }
    document.getElementById('btn-restore').addEventListener('click', async () => {
      const f = document.getElementById('restore-file').files[0];
      if (!f) return alert('Choose a .zip backup file first.');
      const statusEl = document.getElementById('restore-status');
      await restoreBackupZip(f, statusEl, async () => {
        await Promise.all([
          renderPrograms(),
          renderStudents(),
          renderCourses(),
          renderResults(),
          renderAgents(),
          renderFeeGroups(),
          renderPayments(renderLedgerOverview),
          loadProgramsIntoSelects()
        ]);
      });
    });
    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn){
      resetBtn.addEventListener('click', resetAllData);
    }
    // ---------------------- Init ----------------------
    (async function init(){
      await renderPrograms();
      await renderStudents();
      await renderCourses();
      await renderResults();
      await renderAgents();
      await renderFeeGroups();
      await renderPayments(renderLedgerOverview);
      await renderLedgerOverview();
      await loadProgramsIntoSelects();
    })();
  





