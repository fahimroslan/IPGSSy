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
    const values = [
      row.index,
      row.date,
      row.studentName,
      row.feeGroupLabel,
      row.label,
      `${row.signedAmount >= 0 ? '+' : '-'}${row.absAmount.toFixed(2)}`,
      row.noteText
    ];
    values.forEach((value) => {
      const td = document.createElement('td');
      td.className = 'py-2 pr-4';
      td.textContent = String(value ?? '');
      tr.appendChild(td);
    });
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
