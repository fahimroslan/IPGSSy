import { formatMoney, formatFeeGroupCode, getAgentTypeLabel } from '../../utils/formatters.js';
import { calculateInvoiceBalance, isInvoiceOverdue } from '../../services/ledgerService.js';
import { gradeFromMark } from '../../utils/grades.js';
import { db } from '../../db/db.js';

export async function renderStudentProfile(studentId, setCurrentProfileId){
  const content = document.getElementById('profile-content');
  const emptyState = document.getElementById('profile-empty');
  const select = document.getElementById('profile-student');
  const sid = Number(studentId);
  if (!sid){
    if (select && !select.value){
      setCurrentProfileId?.(null);
    }
    if (emptyState){
      emptyState.textContent = 'Select a student to begin.';
      emptyState.classList.remove('hidden');
    }
    if (content){
      content.classList.add('hidden');
    }
    return;
  }
  if (select && select.value !== String(sid)){
    select.value = String(sid);
  }
  const student = await db.students.get(sid);
  if (!student){
    setCurrentProfileId?.(null);
    if (emptyState){
      emptyState.textContent = 'Student not found.';
      emptyState.classList.remove('hidden');
    }
    if (content){
      content.classList.add('hidden');
    }
    return;
  }
  setCurrentProfileId?.(sid);
  const [program, feeGroup] = await Promise.all([
    student.programId ? db.programs.get(student.programId) : null,
    student.feeGroupId ? db.feeGroups.get(student.feeGroupId) : null
  ]);
  const agent = feeGroup?.agentId ? await db.agents.get(feeGroup.agentId) : null;
  const [invoices, paymentsRaw, results, courses] = await Promise.all([
    db.invoices.where('studentIdFk').equals(sid).toArray(),
    db.payments.where('studentIdFk').equals(sid).toArray(),
    db.results.where('studentIdFk').equals(sid).toArray(),
    db.courses.toArray()
  ]);
  const payments = paymentsRaw.filter(p => !p.deleted);
  const billed = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const collected = invoices.reduce((sum, inv) => sum + Math.min(Number(inv.paid) || 0, Number(inv.amount) || 0), 0);
  const outstanding = invoices.reduce((sum, inv) => sum + calculateInvoiceBalance(inv), 0);
  const overdue = invoices.reduce((sum, inv) => sum + (isInvoiceOverdue(inv) ? calculateInvoiceBalance(inv) : 0), 0);
  const discountTotal = payments.reduce((sum, p) => sum + ((p.type || '').toLowerCase() === 'discount' ? (Number(p.amount) || 0) : 0), 0);

  const formatCurrency = (value) => `RM ${formatMoney(value)}`;
  const infoMap = {
    'profile-name': student.name || '-',
    'profile-status': student.status || 'N/A',
    'profile-program': program ? `${program.name}${program.mqaCode ? ` (${program.mqaCode})` : ''}` : '-',
    'profile-feegroup': feeGroup ? `${feeGroup.name} (${formatFeeGroupCode(feeGroup.agentId, feeGroup.sequence)})` : '-',
    'profile-agent': agent ? `${agent.name || '-'} (${getAgentTypeLabel(agent.type)})` : '-',
    'profile-payment-plan': (student.paymentPlan || 'lump').replace(/^\w/, c => c.toUpperCase()),
    'profile-intake': student.intake || '-',
    'profile-registration': student.registrationDate || '-',
    'profile-email': student.email || '-',
    'profile-phone': student.phone || '-'
  };
  Object.entries(infoMap).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el){
      el.textContent = value || '-';
    }
  });
  const statusEl = document.getElementById('profile-status');
  if (statusEl){
    statusEl.className = 'text-xs px-2 py-1 rounded font-semibold';
    const normalizedStatus = (student.status || 'Active').toLowerCase();
    if (normalizedStatus === 'active'){
      statusEl.classList.add('bg-emerald-100', 'text-emerald-700');
    } else if (normalizedStatus === 'defer'){
      statusEl.classList.add('bg-amber-100', 'text-amber-700');
    } else {
      statusEl.classList.add('bg-red-100', 'text-red-700');
    }
    statusEl.textContent = student.status || 'Status';
  }
  const ledgerMap = {
    'profile-ledger-billed': formatCurrency(billed),
    'profile-ledger-collected': formatCurrency(collected),
    'profile-ledger-outstanding': formatCurrency(outstanding),
    'profile-ledger-overdue': formatCurrency(overdue),
    'profile-ledger-discount': formatCurrency(discountTotal)
  };
  Object.entries(ledgerMap).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });

  const invoiceRows = document.getElementById('profile-invoice-rows');
  const invoiceEmpty = document.getElementById('profile-invoice-empty');
  if (invoiceRows){
    invoiceRows.innerHTML = '';
    if (!invoices.length){
      if (invoiceEmpty) invoiceEmpty.classList.remove('hidden');
    } else {
      if (invoiceEmpty) invoiceEmpty.classList.add('hidden');
      invoices
        .slice()
        .sort((a,b)=> (a.createdAt || '').localeCompare(b.createdAt || ''))
        .forEach(inv => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="py-2 pr-4">${(inv.feeType || '').toString().toUpperCase()}</td>
            <td class="py-2 pr-4">${formatCurrency(Number(inv.amount)||0)}</td>
            <td class="py-2 pr-4">${formatCurrency(Number(inv.paid)||0)}</td>
            <td class="py-2 pr-4 capitalize">${inv.status || '-'}</td>
            <td class="py-2 pr-4">${inv.createdAt || '-'}</td>
          `;
          invoiceRows.appendChild(tr);
        });
    }
  }

  const invoiceMap = new Map(invoices.map(inv => [inv.id, inv]));
  const paymentRows = document.getElementById('profile-payment-rows');
  const paymentEmpty = document.getElementById('profile-payment-empty');
  if (paymentRows){
    paymentRows.innerHTML = '';
    if (!payments.length){
      if (paymentEmpty) paymentEmpty.classList.remove('hidden');
    } else {
      if (paymentEmpty) paymentEmpty.classList.add('hidden');
      payments
        .slice()
        .sort((a,b)=> (b.date || '').localeCompare(a.date || ''))
        .forEach(p => {
          const type = (p.type || '').toString().toLowerCase();
          const amount = Number(p.amount) || 0;
          const label = type ? type.charAt(0).toUpperCase() + type.slice(1) : '-';
          const invoice = p.invoiceIdFk ? invoiceMap.get(p.invoiceIdFk) : null;
          const detailBits = [];
          if (invoice && invoice.feeType){
            detailBits.push(`Invoice: ${invoice.feeType.toUpperCase()}`);
          }
          if (p.note){
            detailBits.push(p.note);
          }
          if (p.lastChangeReason){
            detailBits.push(`Reason: ${p.lastChangeReason}`);
          }
          const detailText = detailBits.join(' | ') || '-';
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="py-2 pr-4">${p.date || '-'}</td>
            <td class="py-2 pr-4">${label}</td>
            <td class="py-2 pr-4 ${type === 'credit' ? 'text-emerald-600' : type === 'discount' ? 'text-amber-600' : ''}">
              ${formatCurrency(amount)}
            </td>
            <td class="py-2 pr-4">${detailText}</td>
          `;
          paymentRows.appendChild(tr);
        });
    }
  }

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));
  const resultsBody = document.getElementById('profile-result-rows');
  const resultsEmpty = document.getElementById('profile-result-empty');
  const totalCredits = results.reduce((sum, r) => sum + (Number(r.credit) || 0), 0);
  const totalGradePoints = results.reduce((sum, r) => sum + ((Number(r.point) || 0) * (Number(r.credit) || 0)), 0);
  const gpa = totalCredits ? totalGradePoints / totalCredits : 0;
  const gpaEl = document.getElementById('profile-gpa');
  const creditsEl = document.getElementById('profile-credits');
  if (gpaEl) gpaEl.textContent = gpa.toFixed(2);
  if (creditsEl) creditsEl.textContent = totalCredits.toString();
  if (resultsBody){
    resultsBody.innerHTML = '';
    if (!results.length){
      if (resultsEmpty) resultsEmpty.classList.remove('hidden');
    } else {
      if (resultsEmpty) resultsEmpty.classList.add('hidden');
      results
        .slice()
        .sort((a,b)=> (a.semester || '').localeCompare(b.semester || ''))
        .forEach(res => {
          const course = courseMap[res.courseIdFk];
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="py-2 pr-4">${course ? `${course.code} — ${course.title}` : '-'}</td>
            <td class="py-2 pr-4">${res.semester || '-'}</td>
            <td class="py-2 pr-4">${res.mark ?? '-'}</td>
            <td class="py-2 pr-4">${res.grade || '-'}</td>
            <td class="py-2 pr-4">${Number(res.point || 0).toFixed(2)}</td>
            <td class="py-2 pr-4">${res.credit ?? '-'}</td>
          `;
          resultsBody.appendChild(tr);
        });
    }
  }

  if (emptyState){
    emptyState.classList.add('hidden');
  }
  if (content){
    content.classList.remove('hidden');
  }
}
