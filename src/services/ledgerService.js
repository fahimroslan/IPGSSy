import { db } from '../db/db.js';
import { formatFeeGroupCode, formatMoney } from '../utils/formatters.js';

const LEDGER_OVERVIEW_GRACE_DAYS = 30;

export function calculateInvoiceBalance(invoice) {
  const amount = Number(invoice?.amount) || 0;
  const paid = Number(invoice?.paid) || 0;
  return Math.max(0, amount - paid);
}

export function isInvoiceOverdue(invoice) {
  if (!invoice) return false;
  const created = invoice.createdAt ? new Date(invoice.createdAt) : null;
  if (!created || isNaN(created.getTime())) return false;
  const due = new Date(created);
  due.setDate(due.getDate() + LEDGER_OVERVIEW_GRACE_DAYS);
  return due < new Date() && calculateInvoiceBalance(invoice) > 0;
}

// Dashboard aggregates for financial snapshot
export async function getDashboardFinanceSnapshot() {
  const [students, programs, agents, invoices] = await Promise.all([
    db.students.toArray(),
    db.programs.toArray(),
    db.agents.toArray(),
    db.invoices.toArray(),
  ]);

  const totalBilled = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const totalCollected = invoices.reduce(
    (sum, inv) => sum + Math.min(Number(inv.paid) || 0, Number(inv.amount) || 0),
    0
  );
  const totalPending = invoices.reduce((sum, inv) => sum + calculateInvoiceBalance(inv), 0);
  const totalOverdue = invoices.reduce(
    (sum, inv) => sum + (isInvoiceOverdue(inv) ? calculateInvoiceBalance(inv) : 0),
    0
  );
  const collectedPct = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;

  return {
    counts: {
      students: students.length,
      programs: programs.length,
      agents: agents.length,
    },
    totals: {
      billed: totalBilled,
      collected: totalCollected,
      pending: totalPending,
      overdue: totalOverdue,
      collectedPct,
      outstandingCombined: totalPending,
    },
  };
}

// Payment listing view model (balances included)
export async function getPaymentTableView() {
  const [allPayments, students, feeGroups] = await Promise.all([
    db.payments.orderBy('id').reverse().toArray(),
    db.students.toArray(),
    db.feeGroups.toArray(),
  ]);
  const payments = allPayments.filter((p) => !p.deleted);
  const smap = Object.fromEntries(students.map((s) => [s.id, s.name]));
  const fgmap = Object.fromEntries(
    feeGroups.map((fg) => [fg.id, `${fg.name} (${formatFeeGroupCode(fg.agentId, fg.sequence)})`])
  );

  const balanceMap = {};
  const rows = payments.map((p, i) => {
    const amt = Number(p.amount) || 0;
    const typeRaw = (p.type || 'debit').toString().toLowerCase();
    const signed = typeRaw === 'debit' ? amt : -amt;
    balanceMap[p.studentIdFk] = (balanceMap[p.studentIdFk] || 0) + signed;
    const label = typeRaw ? typeRaw.charAt(0).toUpperCase() + typeRaw.slice(1) : '-';
    const noteText = [p.note || '', p.lastChangeReason ? `Reason: ${p.lastChangeReason}` : '']
      .filter(Boolean)
      .join(' | ');
    return {
      index: i + 1,
      date: p.date || '-',
      studentName: smap[p.studentIdFk] || '-',
      feeGroupLabel: p.feeGroupId ? fgmap[p.feeGroupId] || '-' : '-',
      label,
      signedAmount: signed,
      absAmount: Math.abs(amt),
      noteText,
    };
  });

  const balances = Object.entries(balanceMap)
    .map(([sid, bal]) => ({
      name: smap[sid] || 'Unknown',
      balance: bal,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { rows, balances };
}

// Ledger overview aggregation for profile + main ledger
export async function getLedgerOverview() {
  const [students, feeGroups, invoicesRaw, paymentsRaw] = await Promise.all([
    db.students.toArray(),
    db.feeGroups.toArray(),
    db.invoices.toArray(),
    db.payments.toArray(),
  ]);

  const payments = paymentsRaw.filter((p) => !p.deleted);
  const sById = Object.fromEntries(students.map((s) => [s.id, s]));
  const fgById = Object.fromEntries(
    feeGroups.map((fg) => [
      fg.id,
      { name: fg.name, code: formatFeeGroupCode(fg.agentId, fg.sequence) },
    ])
  );
  const invoicesByStudent = new Map();
  invoicesRaw.forEach((inv) => {
    if (!invoicesByStudent.has(inv.studentIdFk)) invoicesByStudent.set(inv.studentIdFk, []);
    invoicesByStudent.get(inv.studentIdFk).push(inv);
  });
  const paymentsByStudent = new Map();
  payments.forEach((p) => {
    if (!paymentsByStudent.has(p.studentIdFk)) paymentsByStudent.set(p.studentIdFk, []);
    paymentsByStudent.get(p.studentIdFk).push(p);
  });

  const rows = students.map((s, idx) => {
    const invs = invoicesByStudent.get(s.id) || [];
    const pays = paymentsByStudent.get(s.id) || [];
    const billed = invs.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    const collected = invs.reduce(
      (sum, inv) => sum + Math.min(Number(inv.paid) || 0, Number(inv.amount) || 0),
      0
    );
    const discounts = pays
      .filter((p) => (p.type || '').toLowerCase() === 'discount')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const pending = invs.reduce((sum, inv) => sum + calculateInvoiceBalance(inv), 0);
    const overdue = invs.reduce(
      (sum, inv) => sum + (isInvoiceOverdue(inv) ? calculateInvoiceBalance(inv) : 0),
      0
    );
    return {
      index: idx + 1,
      student: s,
      billed,
      collected,
      discounts,
      pending,
      overdue,
      feeGroup: s.feeGroupId ? fgById[s.feeGroupId] : null,
    };
  });

  const totals = rows.reduce(
    (acc, r) => {
      acc.billed += r.billed;
      acc.collected += r.collected;
      acc.discounts += r.discounts;
      acc.pending += r.pending;
      acc.overdue += r.overdue;
      return acc;
    },
    { billed: 0, collected: 0, discounts: 0, pending: 0, overdue: 0 }
  );

  return { rows, totals };
}

export function formatBalancesLine(balances) {
  if (!balances.length) return 'Balances: -';
  return (
    'Balances: ' +
    balances.map((e) => `${e.name}: ${e.balance.toFixed(2)}`).join('; ')
  );
}

export function formatCurrency(value) {
  return `RM ${formatMoney(value)}`;
}
