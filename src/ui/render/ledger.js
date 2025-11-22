import { formatMoney } from '../../utils/formatters.js';
import { calculateInvoiceBalance } from '../../services/ledgerService.js';
import { db } from '../../db/db.js';

export async function renderLedger(studentId, ensureInvoicesForFeeGroup, setSelectedInvoiceId, selectedInvoiceIdRef) {
  const profileEl = document.getElementById('ledger-profile');
  const invoiceTbody = document.getElementById('rows-ledger-invoices');
  const paymentTbody = document.getElementById('rows-ledger-payments');
  const summaryEl = document.getElementById('ledger-balance-summary');
  const selectedInvoiceDisplay = document.getElementById('ledger-selected-invoice');
  if (!profileEl || !invoiceTbody || !paymentTbody || !summaryEl || !selectedInvoiceDisplay) return;

  if (!studentId){
    profileEl.textContent = 'Select a student to view details.';
    invoiceTbody.innerHTML = '';
    paymentTbody.innerHTML = '';
    summaryEl.textContent = '';
    setSelectedInvoiceId?.(null);
    selectedInvoiceDisplay.textContent = 'No invoice selected';
    return;
  }

  const student = await db.students.get(Number(studentId));
  if (!student) {
    profileEl.textContent = 'Student record not found.';
    invoiceTbody.innerHTML = '';
    paymentTbody.innerHTML = '';
    summaryEl.textContent = '';
    setSelectedInvoiceId?.(null);
    selectedInvoiceDisplay.textContent = 'No invoice selected';
    return;
  }

  const [program, feeGroup] = await Promise.all([
    student.programId ? db.programs.get(student.programId) : null,
    student.feeGroupId ? db.feeGroups.get(student.feeGroupId) : null
  ]);
  let invoices = await db.invoices.where('studentIdFk').equals(Number(studentId)).toArray();
  const payments = (await db.payments.where('studentIdFk').equals(Number(studentId)).toArray()).filter(p => !p.deleted);

  // Ensure invoices exist for assigned fee group
  if (student?.feeGroupId && ensureInvoicesForFeeGroup){
    await ensureInvoicesForFeeGroup(student.id, student.feeGroupId);
    invoices = await db.invoices.where('studentIdFk').equals(Number(studentId)).toArray();
  }

  const feeGroupCache = new Map();
  if (student?.feeGroupId && feeGroup){
    feeGroupCache.set(student.feeGroupId, feeGroup);
  }
  const invoiceFeeGroupIds = Array.from(new Set(
    invoices
      .map(inv => inv.feeGroupId)
      .filter(id => id !== null && id !== undefined && !feeGroupCache.has(id))
  ));
  if (invoiceFeeGroupIds.length){
    const extraFeeGroups = await db.feeGroups.bulkGet(invoiceFeeGroupIds);
    extraFeeGroups.forEach((fg, idx) => {
      const id = invoiceFeeGroupIds[idx];
      if (fg && id !== null && id !== undefined){
        feeGroupCache.set(id, fg);
      }
    });
  }

  const normalizedStatus = (student?.status || '').toLowerCase();
  const ledgerStudentName = normalizedStatus === 'suspended'
    ? `<span class="text-red-600 font-semibold">${student?.name||'-'}</span>`
    : (student?.name || '-');

  profileEl.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
      <div><span class="text-gray-500">Name</span><div class="font-medium">${ledgerStudentName}</div></div>
      <div><span class="text-gray-500">Program</span><div class="font-medium">${program?.name||'-'}</div></div>
      <div><span class="text-gray-500">Fee Group</span><div class="font-medium">${feeGroup?.name||'-'}</div></div>
      <div><span class="text-gray-500">Intake</span><div class="font-medium">${student?.intake||'-'}</div></div>
      <div><span class="text-gray-500">Payment Plan</span><div class="font-medium">${(student?.paymentPlan==='installment6' && '6-Month Installment')||(student?.paymentPlan==='installment12' && '12-Month Installment')||'Lump Sum'}</div></div>
      <div><span class="text-gray-500">Registration Date</span><div class="font-medium">${student?.registrationDate||'-'}</div></div>
    </div>
  `;

  // Invoices
  invoices.sort((a,b)=> (a.createdAt||'').localeCompare(b.createdAt||''));
  invoiceTbody.innerHTML = '';
  const hasSelection = invoices.some(inv => inv.id === selectedInvoiceIdRef?.current);
  if (!hasSelection){
    setSelectedInvoiceId?.(null);
  }
  let totalCharge = 0, totalPaid = 0;
  for (let i=0;i<invoices.length;i++){
    const inv = invoices[i];
    const amount = Number(inv.amount)||0;
    const paid = Number(inv.paid)||0;
    const balance = amount - paid;
    const feeGroupLabel = inv.feeGroupId
      ? (feeGroupCache.get(inv.feeGroupId)?.name || '-')
      : 'Manual / Unassigned';
    totalCharge += amount;
    totalPaid += paid;
    const isSelected = selectedInvoiceIdRef?.current === inv.id;
    const tr = document.createElement('tr');
    tr.dataset.invoiceId = inv.id;
    tr.className = `cursor-pointer ${isSelected ? 'bg-purple-50 ring-2 ring-purple-400' : ''}`;
    tr.innerHTML = `
      <td class="py-2 pr-4">${i+1}</td>
      <td class="py-2 pr-4 capitalize">${inv.feeType || '-'}</td>
      <td class="py-2 pr-4">${feeGroupLabel}</td>
      <td class="py-2 pr-4">${formatMoney(amount)}</td>
      <td class="py-2 pr-4">${formatMoney(paid)}</td>
      <td class="py-2 pr-4">${formatMoney(balance)}</td>
      <td class="py-2 pr-4 capitalize">${inv.status || 'open'}</td>
      <td class="py-2 pr-4">${inv.createdAt || '-'}</td>
    `;
    tr.addEventListener('click', () => {
      setSelectedInvoiceId?.(inv.id);
    });
    invoiceTbody.appendChild(tr);
  }
  if (selectedInvoiceIdRef?.current){
    const currentInvoice = invoices.find(inv => inv.id === selectedInvoiceIdRef.current);
    if (currentInvoice){
      const balance = formatMoney(calculateInvoiceBalance(currentInvoice));
      selectedInvoiceDisplay.textContent = `${(currentInvoice.feeType || 'Fee').toString().toUpperCase()} — RM ${formatMoney(currentInvoice.amount)} (Balance: ${balance})`;
      const form = document.getElementById('form-ledger-payment');
      if (form){
        if (form.amount && (!form.amount.value || Number(form.dataset.invoiceId || 0) !== currentInvoice.id)){
          form.amount.value = (Number(currentInvoice.amount) - Number(currentInvoice.paid) || 0).toFixed(2);
          form.dataset.invoiceId = currentInvoice.id;
        }
        if (form.date && !form.date.value){
          form.date.value = new Date().toISOString().slice(0,10);
        }
      }
    } else {
      selectedInvoiceDisplay.textContent = invoices.length ? 'Click an invoice row to select.' : 'No invoices available.';
    }
  } else {
    selectedInvoiceDisplay.textContent = invoices.length ? 'Click an invoice row to select.' : 'No invoices available.';
  }

  // Payments
  paymentTbody.innerHTML = '';
  payments.sort((a,b)=> (a.date||'').localeCompare(b.date||'')).reverse();
  payments.forEach((p, i) => {
    const amt = Number(p.amount)||0;
    const label = (p.type||'').toString().toUpperCase();
    const inv = invoices.find(inv=>inv.id === p.invoiceIdFk);
    const applied = inv ? `${inv.feeType||'Invoice'}` : '-';
    const noteText = [p.note || '', p.lastChangeReason ? `Reason: ${p.lastChangeReason}` : ''].filter(Boolean).join(' | ');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="py-2 pr-4">${i+1}</td>
      <td class="py-2 pr-4">${p.date || '-'}</td>
      <td class="py-2 pr-4">${label}</td>
      <td class="py-2 pr-4">${p.type === 'debit' ? '+' : '-'}${amt.toFixed(2)}</td>
      <td class="py-2 pr-4">${applied}</td>
      <td class="py-2 pr-4">${noteText}</td>
      <td class="py-2 pr-4 space-x-2">
        <button class="text-blue-600 underline text-xs btn-payment-edit" data-id="${p.id}">Edit</button>
        <button class="text-red-600 underline text-xs btn-payment-delete" data-id="${p.id}">Remove</button>
      </td>
    `;
    paymentTbody.appendChild(tr);
  });

  const balance = totalCharge - totalPaid;
  summaryEl.textContent = `Charges: ${totalCharge.toFixed(2)} | Paid/Discounts: ${totalPaid.toFixed(2)} | Balance: ${balance.toFixed(2)}`;
}
