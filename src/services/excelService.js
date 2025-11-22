import { formatFeeGroupCode, formatAgentCode } from '../utils/formatters.js';
import { db } from '../db/db.js';

// Use global XLSX (loaded via CDN in index.html)
const XLSX = window.XLSX;
const saveAs = window.saveAs;

function aoaFromObjects(list, cols){
  const header = cols;
  const rows = list.map(obj => cols.map(c => obj[c]));
  return [header, ...rows];
}

function saveWorkbook(wb, filename){
  XLSX.writeFile(wb, filename);
}

export async function exportSheet(name, rows, columns) {
  const ws = XLSX.utils.aoa_to_sheet(aoaFromObjects(rows, columns));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, name);
  saveWorkbook(wb, `${name}.xlsx`);
}

export async function exportStudents() {
  const [programs, feeGroups] = await Promise.all([
    db.programs.toArray(),
    db.feeGroups.toArray()
  ]);
  const pmap = Object.fromEntries(programs.map(p=>[p.id,p.name]));
  const pmapMqa = Object.fromEntries(programs.map(p=>[p.id,p.mqaCode]));
  const fgCodeMap = Object.fromEntries(feeGroups.map(fg=>[fg.id, formatFeeGroupCode(fg.agentId, fg.sequence)]));
  const students = (await db.students.toArray()).map(s=>({
    id:s.id,
    studentId:s.studentId||'',
    name:s.name,
    email:s.email||'',
    phone:s.phone||'',
    intake:s.intake||'',
    program:pmap[s.programId]||'',
    programMqa:pmapMqa[s.programId]||'',
    feeGroupCode:s.feeGroupId ? (fgCodeMap[s.feeGroupId] || '') : '',
    status:s.status||'Active',
    paymentPlan:s.paymentPlan||'lump',
    registrationDate:s.registrationDate||''
  }));
  await exportSheet('Students', students, ['id','studentId','name','email','phone','intake','program','programMqa','feeGroupCode','status','paymentPlan','registrationDate']);
}

export async function exportPrograms() {
  const programs = await db.programs.toArray();
  await exportSheet('Programs', programs, ['id','mqaCode','name','level','mode','projectType','duration']);
}

export async function exportCourses() {
  const programs = await db.programs.toArray();
  const pmap = Object.fromEntries(programs.map(p=>[p.id,p.name]));
  const courses = (await db.courses.toArray()).map(c=>({
    id:c.id,
    code:c.code,
    title:c.title,
    credit:c.credit,
    program:pmap[c.programId]||''
  }));
  await exportSheet('Courses', courses, ['id','code','title','credit','program']);
}

export async function exportResults() {
  const [students, courses, results] = await Promise.all([
    db.students.toArray(), db.courses.toArray(), db.results.toArray()
  ]);
  const sById = Object.fromEntries(students.map(s=>[s.id,s]));
  const cById = Object.fromEntries(courses.map(c=>[c.id,c]));
  const view = results.map(r=>({
    id:r.id,
    studentId:sById[r.studentIdFk]?.studentId||'',
    name:sById[r.studentIdFk]?.name||'',
    courseCode:cById[r.courseIdFk]?.code||'',
    semester:r.semester,
    mark:r.mark,
    grade:r.grade,
    point:r.point,
    credit:r.credit
  }));
  await exportSheet('Results', view, ['id','studentId','name','courseCode','semester','mark','grade','point','credit']);
}

export async function exportAgents() {
  const agents = await db.agents.toArray();
  const view = agents.map(a=>({
    id:a.id,
    name:a.name,
    email:a.email,
    phone:a.phone,
    agreementLink:a.agreementLink,
    agreement:a.agreement,
    status:a.status,
    type:(a.type || 'external'),
    terminatedAt:a.terminatedAt,
    terminatedReason:a.terminatedReason
  }));
  await exportSheet('Agents', view, ['id','name','email','phone','agreementLink','agreement','status','type','terminatedAt','terminatedReason']);
}

export async function exportFeeGroups() {
  const [feeGroups, programs, agents] = await Promise.all([
    db.feeGroups.toArray(), db.programs.toArray(), db.agents.toArray()
  ]);
  const pmap = Object.fromEntries(programs.map(p=>[p.id,p.name]));
  const amap = Object.fromEntries(agents.map(a=>[a.id,a.name]));
  const view = feeGroups.map(fg=>({
    id:fg.id,
    name:fg.name,
    program:pmap[fg.programId]||'',
    agent:amap[fg.agentId]||'',
    agentCode:formatAgentCode(fg.agentId),
    sequence:fg.sequence||'',
    feeGroupCode:formatFeeGroupCode(fg.agentId, fg.sequence),
    registrationFee:fg.registrationFee,
    tuitionFee:fg.tuitionFee,
    convocationFee:fg.convocationFee
  }));
  await exportSheet('FeeGroups', view, ['id','name','program','agent','agentCode','sequence','feeGroupCode','registrationFee','tuitionFee','convocationFee']);
}

export async function exportPayments() {
  const [allPayments, students, feeGroups] = await Promise.all([
    db.payments.toArray(), db.students.toArray(), db.feeGroups.toArray()
  ]);
  const payments = allPayments.filter(p => !p.deleted);
  const sById = Object.fromEntries(students.map(s=>[s.id,s]));
  const fgById = Object.fromEntries(feeGroups.map(fg=>[fg.id, {
    name: fg.name,
    code: formatFeeGroupCode(fg.agentId, fg.sequence)
  }]));
  const view = payments.map(p=>({
    id:p.id,
    studentId:sById[p.studentIdFk]?.studentId||'',
    name:sById[p.studentIdFk]?.name||'',
    feeGroup:p.feeGroupId ? (fgById[p.feeGroupId]?.name||'') : '',
    feeGroupCode:p.feeGroupId ? (fgById[p.feeGroupId]?.code||'') : '',
    invoiceId:p.invoiceIdFk||'',
    type:p.type,
    amount:p.amount,
    date:p.date,
    note:p.note,
    reason:p.lastChangeReason||''
  }));
  await exportSheet('Payments', view, ['id','studentId','name','feeGroup','feeGroupCode','invoiceId','type','amount','date','note','reason']);
}

export async function exportInvoices() {
  const [invoices, students, feeGroups] = await Promise.all([
    db.invoices.toArray(), db.students.toArray(), db.feeGroups.toArray()
  ]);
  const sById = Object.fromEntries(students.map(s=>[s.id,s]));
  const fgById = Object.fromEntries(feeGroups.map(fg=>[fg.id, {
    name: fg.name,
    code: formatFeeGroupCode(fg.agentId, fg.sequence)
  }]));
  const view = invoices.map(inv=>({
    id:inv.id,
    studentId:sById[inv.studentIdFk]?.studentId||'',
    name:sById[inv.studentIdFk]?.name||'',
    feeGroup:inv.feeGroupId ? (fgById[inv.feeGroupId]?.name||'') : '',
    feeGroupCode:inv.feeGroupId ? (fgById[inv.feeGroupId]?.code||'') : '',
    feeType:inv.feeType,
    amount:inv.amount,
    paid:inv.paid,
    status:inv.status,
    createdAt:inv.createdAt
  }));
  await exportSheet('Invoices', view, ['id','studentId','name','feeGroup','feeGroupCode','feeType','amount','paid','status','createdAt']);
}
