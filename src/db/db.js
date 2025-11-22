// Dexie database setup and versioned migrations
export const db = new Dexie('pgsm_db_stage3');

// v1/v2 from earlier stages
db.version(1).stores({
  programs: '++id, name, level, mode, duration',
  students: '++id, studentId, name, email, phone, intake, programId, status'
});
db.version(2).stores({
  programs: '++id, name, level, mode, duration',
  students: '++id, studentId, name, email, phone, intake, programId, status',
  courses: '++id, code, title, credit, programId',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit'
});
db.version(3).stores({
  programs: '++id, name, level, mode, duration',
  students: '++id, studentId, name, email, phone, intake, programId, status',
  courses: '++id, code, title, credit, programId',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit',
  agents: '++id, name, email, phone',
  feeGroups: '++id, name, programId, agentId',
  payments: '++id, studentIdFk, feeGroupId, type, date'
});
db.version(4).stores({
  programs: '++id, name, level, mode, duration',
  students: '++id, studentId, name, email, phone, intake, programId, feeGroupId, status',
  courses: '++id, code, title, credit, programId',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit',
  agents: '++id, name, email, phone',
  feeGroups: '++id, name, programId, agentId',
  invoices: '++id, studentIdFk, feeGroupId, feeType, status, createdAt',
  payments: '++id, studentIdFk, feeGroupId, invoiceIdFk, type, date'
});
db.version(5).stores({
  programs: '++id, name, level, mode, duration',
  students: '++id, studentId, name, email, phone, intake, programId, feeGroupId, paymentPlan, status',
  courses: '++id, code, title, credit, programId',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit',
  agents: '++id, name, email, phone',
  feeGroups: '++id, name, programId, agentId',
  invoices: '++id, studentIdFk, feeGroupId, feeType, status, createdAt',
  payments: '++id, studentIdFk, feeGroupId, invoiceIdFk, type, date'
});
db.version(6).stores({
  programs: '++id, name, level, mode, duration',
  students: '++id, studentId, name, email, phone, intake, programId, feeGroupId, paymentPlan, registrationDate, status',
  courses: '++id, code, title, credit, programId',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit',
  agents: '++id, name, email, phone',
  feeGroups: '++id, name, programId, agentId',
  invoices: '++id, studentIdFk, feeGroupId, feeType, status, createdAt',
  payments: '++id, studentIdFk, feeGroupId, invoiceIdFk, type, date'
});
db.version(7).stores({
  programs: '++id, name, mode, duration',
  students: '++id, studentId, name, email, phone, intake, programId, feeGroupId, paymentPlan, registrationDate, status',
  courses: '++id, code, title, credit, programId',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit',
  agents: '++id, name, email, phone',
  feeGroups: '++id, name, programId, agentId',
  invoices: '++id, studentIdFk, feeGroupId, feeType, status, createdAt',
  payments: '++id, studentIdFk, feeGroupId, invoiceIdFk, type, date'
});
db.version(8).stores({
  programs: '++id, name, mode, duration, projectType',
  students: '++id, studentId, name, email, phone, intake, programId, feeGroupId, paymentPlan, registrationDate, status',
  courses: '++id, code, title, credit',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit',
  agents: '++id, name, email, phone',
  feeGroups: '++id, name, programId, agentId',
  invoices: '++id, studentIdFk, feeGroupId, feeType, status, createdAt',
  payments: '++id, studentIdFk, feeGroupId, invoiceIdFk, type, date'
});
db.version(9).stores({
  programs: '++id, name, mode, duration, projectType',
  students: '++id, studentId, name, email, phone, intake, programId, feeGroupId, paymentPlan, registrationDate, status',
  courses: '++id, code, title, credit, programId',
  studentCourses: '++id, studentIdFk, courseIdFk',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit',
  agents: '++id, name, email, phone',
  feeGroups: '++id, name, programId, agentId',
  invoices: '++id, studentIdFk, feeGroupId, feeType, status, createdAt',
  payments: '++id, studentIdFk, feeGroupId, invoiceIdFk, type, date'
});
db.version(10).stores({
  programs: '++id, name, mode, duration, projectType, level',
  students: '++id, studentId, name, email, phone, intake, programId, feeGroupId, paymentPlan, registrationDate, status',
  courses: '++id, code, title, credit, programId',
  studentCourses: '++id, studentIdFk, courseIdFk',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit',
  agents: '++id, name, email, phone',
  feeGroups: '++id, name, programId, agentId',
  invoices: '++id, studentIdFk, feeGroupId, feeType, status, createdAt',
  payments: '++id, studentIdFk, feeGroupId, invoiceIdFk, type, date'
}).upgrade(tx => {
  return tx.programs.toCollection().modify(p => {
    if (!p.level){
      p.level = 'Master';
    }
  });
});
db.version(11).stores({
  programs: '++id, name, mode, duration, projectType, level',
  students: '++id, studentId, name, email, phone, intake, programId, feeGroupId, paymentPlan, registrationDate, status',
  courses: '++id, code, title, credit, programId',
  studentCourses: '++id, studentIdFk, courseIdFk',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit',
  agents: '++id, name, email, phone, status',
  feeGroups: '++id, name, programId, agentId',
  invoices: '++id, studentIdFk, feeGroupId, feeType, status, createdAt',
  payments: '++id, studentIdFk, feeGroupId, invoiceIdFk, type, date'
}).upgrade(tx => {
  return tx.agents.toCollection().modify(a => {
    if (!a.status){
      a.status = 'Active';
    }
    if (typeof a.agreementLink === 'undefined'){
      a.agreementLink = '';
    }
    if (typeof a.terminatedAt === 'undefined'){
      a.terminatedAt = '';
    }
    if (typeof a.terminatedReason === 'undefined'){
      a.terminatedReason = '';
    }
  });
});
db.version(12).stores({
  programs: '++id, mqaCode, name, mode, duration, projectType, level',
  students: '++id, studentId, name, email, phone, intake, programId, feeGroupId, paymentPlan, registrationDate, status',
  courses: '++id, code, title, credit, programId',
  studentCourses: '++id, studentIdFk, courseIdFk',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit',
  agents: '++id, name, email, phone, status',
  feeGroups: '++id, name, programId, agentId, sequence',
  invoices: '++id, studentIdFk, feeGroupId, feeType, status, createdAt',
  payments: '++id, studentIdFk, feeGroupId, invoiceIdFk, type, date'
}).upgrade(async tx => {
  await tx.programs.toCollection().modify(p => {
    if (typeof p.mqaCode === 'undefined'){
      p.mqaCode = '';
    }
  });
  const seqTracker = {};
  const allFeeGroups = await tx.feeGroups.toArray();
  allFeeGroups.forEach(fg => {
    if (!fg.agentId) return;
    const current = Number(fg.sequence) || 0;
    seqTracker[fg.agentId] = Math.max(seqTracker[fg.agentId] || 0, current);
  });
  for (const fg of allFeeGroups){
    if (fg.sequence) continue;
    const agentId = fg.agentId;
    if (!agentId) continue;
    const nextSeq = (seqTracker[agentId] || 0) + 1;
    seqTracker[agentId] = nextSeq;
    await tx.feeGroups.update(fg.id, { sequence: nextSeq });
  }
});
db.version(13).stores({
  programs: '++id, mqaCode, name, mode, duration, projectType, level',
  students: '++id, studentId, name, email, phone, intake, programId, feeGroupId, paymentPlan, registrationDate, status',
  courses: '++id, code, title, credit, programId',
  studentCourses: '++id, studentIdFk, courseIdFk',
  results: '++id, studentIdFk, courseIdFk, semester, mark, grade, point, credit',
  agents: '++id, name, email, phone, status, type',
  feeGroups: '++id, name, programId, agentId, sequence',
  invoices: '++id, studentIdFk, feeGroupId, feeType, status, createdAt',
  payments: '++id, studentIdFk, feeGroupId, invoiceIdFk, type, date'
}).upgrade(async tx => {
  await tx.agents.toCollection().modify(a => {
    if (!a.status){
      a.status = 'Active';
    }
    if (!a.type){
      a.type = 'external';
    }
  });
});
