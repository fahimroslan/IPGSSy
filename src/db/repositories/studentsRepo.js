import { db } from '../db.js';

export async function getAllStudents() {
  return db.students.toArray();
}

export async function getStudentById(id) {
  return db.students.get(Number(id));
}

export async function addStudent(data) {
  return db.students.add(data);
}

export async function updateStudent(id, changes) {
  return db.students.update(Number(id), changes);
}

export async function deleteStudent(id) {
  return db.students.delete(Number(id));
}
