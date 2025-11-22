# coding: utf-8
from pathlib import Path
text = Path('src/main.js').read_text(encoding='utf-8')
start = text.find('async function renderLedgerOverview')
if start == -1:
    raise SystemExit('not found')
rest = text[start+1:]
idx = rest.find('\n    async function ')
end = start + 1 + idx if idx != -1 else len(text)
new_block = """
    async function renderLedgerOverview(){
      const programSelect = document.getElementById('ledger-filter-program');
      const agentSelect = document.getElementById('ledger-filter-agent');
      const studentSelect = document.getElementById('ledger-filter-student');
      const tableBody = document.getElementById('rows-ledger-overview');
      const emptyEl = document.getElementById('ledger-overview-empty');
      if (!programSelect || !agentSelect || !studentSelect || !tableBody || !emptyEl) return;

      const [students, programs, agents, feeGroups, invoices, rawPayments] = await Promise.all([
        db.students.toArray(),
        db.programs.toArray(),
        db.agents.toArray(),
        db.feeGroups.toArray(),
        db.invoices.toArray(),
        db.payments.toArray()
      ]);

      const payments = rawPayments.filter(p => !p.deleted);
      const programMap = new Map(programs.map(p => [p.id, p]));
      const agentMap = new Map(agents.map(a => [a.id, a]));
      const feeGroupMap = new Map(feeGroups.map(fg => [fg.id, fg]));

      const programOptions = programs
        .map(p => {
          const base = p.name || `Program #${p.id}`;
          const label = p.mqaCode ? `${base} (${p.mqaCode})` : base;
          return { value: p.id, label };
        })
        .sort((a,b)=>a.label.localeCompare(b.label));
      const agentOptions = agents
        .map(a => ({
          value: String(a.id),
          label: f"{formatAgentCode(a.id)} - {a.name or f'Agent #{a.id}'} ({getAgentTypeLabel(a.type)})"
        }))
        .sort((a,b)=>a.label.localeCompare(b.label));

      const prevProgram = programSelect.value;
      const prevAgent = agentSelect.value;
      const prevStudent = studentSelect.value;

      const currentProgram = rebuildLedgerFilter(programSelect, programOptions, 'All Programs', prevProgram);
      const currentAgent = rebuildLedgerFilter(agentSelect, agentOptions, 'All Agents', prevAgent);

      const studentOptionsSource = students
        .filter(s => {
          const matchesProgram = not currentProgram or str(s.programId or '') == currentProgram;
          const fg = feeGroupMap.get(s.feeGroupId) if s.feeGroupId else None;
          const agentId = str(fg.agentId) if fg and fg.agentId is not None else '';
          const matchesAgent = not currentAgent or agentId == currentAgent;
          return matchesProgram and matchesAgent;
        })
        .map(lambda s: { 'value': s.id, 'label': s.name or f"Student #{s.id}" })
      
      studentOptionsSource = sorted(studentOptionsSource, key=lambda o: o['label'])

      currentStudent = rebuildLedgerFilter(studentSelect, studentOptionsSource, 'All Students', prevStudent)

      filters = {
        'program': currentProgram,
        'agent': currentAgent,
        'student': currentStudent
      }

      filteredStudents = [student for student in students if (
        (not filters['program'] or str(student.programId or '') == filters['program']) and
        (not filters['student'] or str(student.id) == filters['student']) and
        (lambda fg: (not filters['agent'] or (fg and str(fg.agentId) == filters['agent']))) (feeGroupMap.get(student.feeGroupId) if student.feeGroupId else None)
      )]

      rows = []
      for idx, student in enumerate(sorted(filteredStudents, key=lambda s: s.name or '')):
        invs = [inv for inv in invoices if inv.studentIdFk == student.id]
        billed = sum((inv.amount or 0) for inv in invs)
        collected = sum(min(inv.paid or 0, inv.amount or 0) for inv in invs)
        pending = sum(calculateInvoiceBalance(inv) for inv in invs)
        overdue = sum(calculateInvoiceBalance(inv) for inv in invs if isInvoiceOverdue(inv))
        discounts = sum((p.amount or 0) for p in payments if p.studentIdFk == student.id and (p.type or '').lower() == 'discount')
        fg = feeGroupMap.get(student.feeGroupId) if student.feeGroupId else None
        agent = agentMap.get(fg.agentId) if fg and fg.agentId else None
        rows.append({
          'index': idx + 1,
          'student': student,
          'billed': billed,
          'collected': collected,
          'pending': pending,
          'overdue': overdue,
          'discounts': discounts,
          'fg': fg,
          'agent': agent
        })

      tableBody.innerHTML = ''
      if not rows:
        emptyEl.classList.remove('hidden')
        Path('src/main.js').write_text(text, encoding='utf-8')
        exit()
      emptyEl.classList.add('hidden')

      totals = {'billed':0,'collected':0,'pending':0,'overdue':0,'discounts':0}
      for row in rows:
        totals['billed'] += row['billed']
        totals['collected'] += row['collected']
        totals['pending'] += row['pending']
        totals['overdue'] += row['overdue']
        totals['discounts'] += row['discounts']

      for row in rows:
        percentage = (row['billed'] / totals['billed'] * 100) if totals['billed'] else 0
        fg = row['fg']
        agent = row['agent']
        tableBody.innerHTML += f"""
          <tr>
            <td class='py-2 pr-4'>{row['index']}</td>
            <td class='py-2 pr-4'>{row['student'].studentId or '-'}</td>
            <td class='py-2 pr-4'>{row['student'].name or '-'}</td>
            <td class='py-2 pr-4'>{programMap.get(row['student'].programId).name if row['student'].programId and programMap.get(row['student'].programId) else '-'}</td>
            <td class='py-2 pr-4'>{f"{fg.name or ''} ({formatFeeGroupCode(fg.agentId, fg.sequence)})" if fg else '-'}</td>
            <td class='py-2 pr-4'>{f"{agent.name or '-'} ({getAgentTypeLabel(agent.type)})" if agent else '-'}</td>
            <td class='py-2 pr-4'>RM {formatMoney(row['billed'])}</td>
            <td class='py-2 pr-4'>RM {formatMoney(row['collected'])}</td>
            <td class='py-2 pr-4 text-emerald-600'>{f"RM {formatMoney(row['discounts'])}" if row['discounts'] else '-'}</td>
            <td class='py-2 pr-4'>RM {formatMoney(row['pending'])}</td>
            <td class='py-2 pr-4'>RM {formatMoney(row['overdue'])}</td>
            <td class='py-2 pr-4 text-sm text-gray-600'>{percentage:.1f}%</td>
          </tr>
        """

      totalsRow = document.getElementById('ledger-overview-totals')
      if totalsRow:
        totalsRow.innerHTML = f"""
          <td class='py-2 pr-4 font-semibold' colspan='6'>Totals</td>
          <td class='py-2 pr-4 font-semibold'>RM {formatMoney(totals['billed'])}</td>
          <td class='py-2 pr-4 font-semibold'>RM {formatMoney(totals['collected'])}</td>
          <td class='py-2 pr-4 font-semibold text-emerald-600'>{f"RM {formatMoney(totals['discounts'])}" if totals['discounts'] else '-'}</td>
          <td class='py-2 pr-4 font-semibold'>RM {formatMoney(totals['pending'])}</td>
          <td class='py-2 pr-4 font-semibold'>RM {formatMoney(totals['overdue'])}</td>
          <td></td>
        """

      Path('src/main.js').write_text(text[:start] + new_block + text[end:], encoding='utf-8')
