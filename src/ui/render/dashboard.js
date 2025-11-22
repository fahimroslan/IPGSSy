import { formatMoney } from '../../utils/formatters.js';
import { getDashboardFinanceSnapshot, formatCurrency } from '../../services/ledgerService.js';
import { getAllPrograms } from '../../db/repositories/programsRepo.js';
import { getAllStudents } from '../../db/repositories/studentsRepo.js';

export async function renderDashboard(){
  const studentTotalEl = document.getElementById('dashboard-total-students');
  if (!studentTotalEl) return;
  const { counts, totals } = await getDashboardFinanceSnapshot();
  const totalStudents = counts.students;
  const totalPrograms = counts.programs;
  const totalAgents = counts.agents;
  const totalBilled = totals.billed;
  const totalCollected = totals.collected;
  const totalPending = totals.pending;
  const totalOverdue = totals.overdue;
  const outstandingCombined = totals.outstandingCombined;
  const collectedPct = totals.collectedPct;

  studentTotalEl.textContent = totalStudents.toString();
  const programEl = document.getElementById('dashboard-total-programs');
  const agentEl = document.getElementById('dashboard-total-agents');
  const collectedEl = document.getElementById('dashboard-total-collected');
  const collectedPctEl = document.getElementById('dashboard-collected-percentage');
  const billedEl = document.getElementById('dashboard-total-billed');
  const pendingEl = document.getElementById('dashboard-total-pending');
  const overdueEl = document.getElementById('dashboard-total-overdue');
  const outstandingEl = document.getElementById('dashboard-total-outstanding');
  const updatedEl = document.getElementById('dashboard-last-updated');
  if (programEl) programEl.textContent = totalPrograms.toString();
  if (agentEl) agentEl.textContent = totalAgents.toString();
  if (collectedEl) collectedEl.textContent = formatCurrency(totalCollected);
  if (collectedPctEl) collectedPctEl.textContent = totalBilled
    ? `${collectedPct.toFixed(1)}% of RM ${formatMoney(totalBilled)}`
    : 'No invoices yet';
  if (billedEl) billedEl.textContent = formatCurrency(totalBilled);
  if (pendingEl) pendingEl.textContent = formatCurrency(totalPending);
  if (overdueEl) overdueEl.textContent = formatCurrency(totalOverdue);
  if (outstandingEl) outstandingEl.textContent = formatCurrency(outstandingCombined);
  if (updatedEl) updatedEl.textContent = `Updated ${new Date().toLocaleTimeString()}`;

  const programCountMap = new Map();
  const programs = await getAllPrograms();
  const students = await getAllStudents();
  programs.forEach(p => {
    programCountMap.set(p.id, {
      name: p.name || `Program #${p.id}`,
      mqa: p.mqaCode || '',
      count: 0
    });
  });
  let unassignedCount = 0;
  students.forEach(student => {
    if (student.programId && programCountMap.has(student.programId)){
      const entry = programCountMap.get(student.programId);
      entry.count += 1;
    } else {
      unassignedCount += 1;
    }
  });
  const programRows = Array.from(programCountMap.values());
  if (unassignedCount){
    programRows.push({
      name: 'Unassigned Students',
      mqa: '',
      count: unassignedCount
    });
  }
  programRows.sort((a, b) => {
    if (b.count === a.count){
      return a.name.localeCompare(b.name);
    }
    return b.count - a.count;
  });
  const programBody = document.getElementById('dashboard-program-rows');
  const programEmpty = document.getElementById('dashboard-program-empty');
  const programTotalLabel = document.getElementById('dashboard-program-total');
  if (programTotalLabel){
    programTotalLabel.textContent = `${totalPrograms} program${totalPrograms === 1 ? '' : 's'}`;
  }
  if (programBody){
    programBody.innerHTML = '';
    if (!programRows.length){
      if (programEmpty) programEmpty.classList.remove('hidden');
    } else {
      if (programEmpty) programEmpty.classList.add('hidden');
      programRows.forEach(row => {
        const percentage = totalStudents ? ((row.count / totalStudents) * 100) : 0;
        const label = row.mqa ? `${row.name} (${row.mqa})` : row.name;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="py-2 pr-4">${label}</td>
          <td class="py-2 pr-4 font-semibold">${row.count}</td>
          <td class="py-2 pr-4 text-sm text-gray-600">${percentage.toFixed(1)}%</td>
        `;
        programBody.appendChild(tr);
      });
    }
  }
  if (programEmpty && !programRows.length){
    programEmpty.textContent = 'No enrollment data yet.';
  }
}
