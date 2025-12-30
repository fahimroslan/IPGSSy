import { db } from '../db/db.js';

// Use globals provided by CDN
const JSZip = window.JSZip;
const saveAs = window.saveAs;

export async function exportBackupZip(){
  const zip = new JSZip();
  const [programs, students, courses, results, agents, feeGroups, payments, invoices, studentCourses] = await Promise.all([
    db.programs.toArray(),
    db.students.toArray(),
    db.courses.toArray(),
    db.results.toArray(),
    db.agents.toArray(),
    db.feeGroups.toArray(),
    db.payments.toArray(),
    db.invoices.toArray(),
    db.studentCourses.toArray()
  ]);
  const meta = { exportedAt: new Date().toISOString(), schemaVersion: db.verno };
  zip.file('meta.json', JSON.stringify(meta, null, 2));
  zip.file('programs.json', JSON.stringify(programs));
  zip.file('students.json', JSON.stringify(students));
  zip.file('courses.json', JSON.stringify(courses));
  zip.file('results.json', JSON.stringify(results));
  zip.file('agents.json', JSON.stringify(agents));
  zip.file('feeGroups.json', JSON.stringify(feeGroups));
  zip.file('payments.json', JSON.stringify(payments));
  zip.file('invoices.json', JSON.stringify(invoices));
  zip.file('studentCourses.json', JSON.stringify(studentCourses));
  const blob = await zip.generateAsync({type:'blob'});
  saveAs(blob, `pgsm_backup_${new Date().toISOString().replace(/[:T]/g,'-').slice(0,19)}.zip`);
}

export async function restoreBackupZip(file, statusEl, onDone) {
  const status = statusEl;
  status.textContent = 'Reading backup...';
  const data = await file.arrayBuffer();
  let zip;
  try {
    zip = await JSZip.loadAsync(data);
  } catch (err) {
    status.textContent = 'Invalid ZIP file.';
    return;
  }

  const requiredFiles = ['meta.json','programs.json','students.json','courses.json','results.json'];
  const optionalFiles = ['agents.json','feeGroups.json','payments.json','invoices.json','studentCourses.json'];
  for (const f of requiredFiles){
    if (!zip.file(f)){
      status.textContent = `Invalid backup: missing ${f}`;
      return;
    }
  }

  const meta = JSON.parse(await zip.file('meta.json').async('string'));
  if (meta?.schemaVersion && meta.schemaVersion !== db.verno){
    const proceed = confirm(
      `Backup schema v${meta.schemaVersion} differs from current v${db.verno}. Restoring may be incompatible. Continue?`
    );
    if (!proceed){
      status.textContent = 'Cancelled.';
      return;
    }
  }
  const programs = JSON.parse(await zip.file('programs.json').async('string'));
  const students = JSON.parse(await zip.file('students.json').async('string'));
  const courses = JSON.parse(await zip.file('courses.json').async('string'));
  const results = JSON.parse(await zip.file('results.json').async('string'));
  const agents = zip.file('agents.json') ? JSON.parse(await zip.file('agents.json').async('string')) : [];
  const feeGroups = zip.file('feeGroups.json') ? JSON.parse(await zip.file('feeGroups.json').async('string')) : [];
  const payments = zip.file('payments.json') ? JSON.parse(await zip.file('payments.json').async('string')) : [];
  const invoices = zip.file('invoices.json') ? JSON.parse(await zip.file('invoices.json').async('string')) : [];
  const studentCourses = zip.file('studentCourses.json') ? JSON.parse(await zip.file('studentCourses.json').async('string')) : [];

  if (!confirm('Restore will REPLACE existing data. Continue?')){
    status.textContent = 'Cancelled.';
    return;
  }

  await db.transaction('rw', db.programs, db.students, db.courses, db.results, db.agents, db.feeGroups, db.payments, db.invoices, db.studentCourses, async () => {
    await db.programs.clear();
    await db.students.clear();
    await db.courses.clear();
    await db.results.clear();
    await db.agents.clear();
    await db.feeGroups.clear();
    await db.payments.clear();
    await db.invoices.clear();
    await db.studentCourses.clear();
    await db.programs.bulkAdd(programs);
    await db.students.bulkAdd(students);
    await db.courses.bulkAdd(courses);
    await db.results.bulkAdd(results);
    if (agents.length) await db.agents.bulkAdd(agents);
    if (feeGroups.length) await db.feeGroups.bulkAdd(feeGroups);
    if (payments.length) await db.payments.bulkAdd(payments);
    if (invoices.length) await db.invoices.bulkAdd(invoices);
    if (studentCourses.length) await db.studentCourses.bulkAdd(studentCourses);
  });
  status.textContent = `Restored backup (schema v${meta.schemaVersion}).`;

  if (typeof onDone === 'function'){
    await onDone();
  }
}
