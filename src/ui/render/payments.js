import { getPaymentTableView, formatBalancesLine } from '../../services/ledgerService.js';

/**
 * Render the payments table and balances summary.
 * @param {Function} afterRender Optional callback (e.g., renderLedgerOverview) to run after payments are rendered.
 */
export async function renderPayments(afterRender) {
  const tbody = document.getElementById('rows-payments');
  if (!tbody) return;
  tbody.innerHTML = '';
  const { rows, balances } = await getPaymentTableView();

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="py-2 pr-4">${row.index}</td>
      <td class="py-2 pr-4">${row.date}</td>
      <td class="py-2 pr-4">${row.studentName}</td>
      <td class="py-2 pr-4">${row.feeGroupLabel}</td>
      <td class="py-2 pr-4">${row.label}</td>
      <td class="py-2 pr-4">${row.signedAmount >= 0 ? '+' : '-'}${row.absAmount.toFixed(2)}</td>
      <td class="py-2 pr-4">${row.noteText}</td>
    `;
    tbody.appendChild(tr);
  });

  const balancesEl = document.getElementById('payment-balances');
  if (balancesEl){
    balancesEl.textContent = formatBalancesLine(balances);
  }

  if (typeof afterRender === 'function'){
    await afterRender();
  }
}
