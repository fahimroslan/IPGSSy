import { db } from '../db.js';

export async function getAllPrograms() {
  return db.programs.toArray();
}

export async function getProgramById(id) {
  return db.programs.get(Number(id));
}

export async function addProgram(data) {
  return db.programs.add(data);
}

export async function updateProgram(id, changes) {
  return db.programs.update(Number(id), changes);
}

export async function deleteProgram(id) {
  return db.programs.delete(Number(id));
}
