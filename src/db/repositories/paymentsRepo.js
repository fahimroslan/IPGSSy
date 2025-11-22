import { db } from '../db.js';

export async function getAllPayments() {
  return db.payments.toArray();
}

export async function getPaymentsByStudent(studentId) {
  return db.payments.where('studentIdFk').equals(Number(studentId)).toArray();
}

export async function addPayment(data) {
  return db.payments.add(data);
}

export async function updatePayment(id, changes) {
  return db.payments.update(Number(id), changes);
}

export async function deletePayment(id) {
  return db.payments.delete(Number(id));
}
