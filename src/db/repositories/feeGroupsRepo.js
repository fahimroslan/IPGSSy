import { db } from '../db.js';

export async function getAllFeeGroups() {
  return db.feeGroups.toArray();
}

export async function getFeeGroupById(id) {
  return db.feeGroups.get(Number(id));
}

export async function addFeeGroup(data) {
  return db.feeGroups.add(data);
}

export async function updateFeeGroup(id, changes) {
  return db.feeGroups.update(Number(id), changes);
}

export async function deleteFeeGroup(id) {
  return db.feeGroups.delete(Number(id));
}
