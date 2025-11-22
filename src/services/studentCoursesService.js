import { db } from '../db/db.js';

export async function syncStudentCourses(studentId, programId) {
  if (!studentId) return;
  await db.studentCourses.where('studentIdFk').equals(studentId).delete();
  if (!programId) return;
  const courses = await db.courses.where('programId').equals(programId).toArray();
  if (!courses.length) return;
  const rows = courses.map((c) => ({ studentIdFk: studentId, courseIdFk: c.id }));
  await db.studentCourses.bulkAdd(rows);
}

export async function assignCourseToStudents(courseId, programId) {
  if (!courseId || !programId) return;
  const students = await db.students.where('programId').equals(programId).toArray();
  if (!students.length) return;
  const rows = students.map((s) => ({ studentIdFk: s.id, courseIdFk: courseId }));
  await db.studentCourses.bulkAdd(rows);
}

export async function deleteCourseCascade(courseId) {
  await db.transaction('rw', db.courses, db.studentCourses, db.results, async () => {
    await db.courses.delete(courseId);
    await db.studentCourses.where('courseIdFk').equals(courseId).delete();
    await db.results.where('courseIdFk').equals(courseId).delete();
  });
}

export async function deleteProgramCascade(programId) {
  const [courseList, studentList] = await Promise.all([
    db.courses.where('programId').equals(programId).toArray(),
    db.students.where('programId').equals(programId).toArray(),
  ]);
  const courseIds = courseList.map((c) => c.id);
  const studentIds = studentList.map((s) => s.id);
  await db.transaction(
    'rw',
    db.programs,
    db.courses,
    db.students,
    db.studentCourses,
    db.results,
    db.feeGroups,
    async () => {
      await db.programs.delete(programId);
      if (courseIds.length) {
        await db.courses.bulkDelete(courseIds);
        await db.studentCourses.where('courseIdFk').anyOf(courseIds).delete();
        await db.results.where('courseIdFk').anyOf(courseIds).delete();
      }
      if (studentIds.length) {
        await db.students.where('id').anyOf(studentIds).modify({ programId: null });
        await db.studentCourses.where('studentIdFk').anyOf(studentIds).delete();
      }
      await db.feeGroups.where('programId').equals(programId).modify({ programId: null });
    }
  );
}

let studentCoursesSeeded = false;
export async function ensureStudentCoursesSeeded() {
  if (studentCoursesSeeded) return;
  const [studentCount, linkCount] = await Promise.all([
    db.students.count(),
    db.studentCourses.count(),
  ]);
  if (!studentCount || linkCount) {
    studentCoursesSeeded = true;
    return;
  }
  const students = await db.students.toArray();
  for (const stu of students) {
    if (stu.programId) {
      await syncStudentCourses(stu.id, stu.programId);
    }
  }
  studentCoursesSeeded = true;
}
