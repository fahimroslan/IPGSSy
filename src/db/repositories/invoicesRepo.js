import { db } from '../db.js';

export async function getAllInvoices() {
  return db.invoices.toArray();
}

export async function getInvoicesByStudent(studentId) {
  return db.invoices.where('studentIdFk').equals(Number(studentId)).toArray();
}

export async function addInvoice(data) {
  return db.invoices.add(data);
}

export async function updateInvoice(id, changes) {
  return db.invoices.update(Number(id), changes);
}

export async function deleteInvoice(id) {
  return db.invoices.delete(Number(id));
}
