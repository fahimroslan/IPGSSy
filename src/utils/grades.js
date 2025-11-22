export function gradeFromMark(mark) {
  const m = Number(mark);
  if (isNaN(m)) return { grade: '-', point: 0 };
  if (m >= 85) return { grade: m === 85 ? 'A' : 'A+', point: 4.0 };
  if (m >= 75) return { grade: 'A-', point: 3.67 };
  if (m >= 70) return { grade: 'B+', point: 3.33 };
  if (m >= 65) return { grade: 'B', point: 3.0 };
  if (m >= 60) return { grade: 'B-', point: 2.67 };
  if (m >= 55) return { grade: 'C+', point: 2.33 };
  if (m >= 50) return { grade: 'C', point: 2.0 };
  if (m >= 45) return { grade: 'D+', point: 1.67 };
  if (m >= 40) return { grade: 'D', point: 1.33 };
  return { grade: 'F', point: 0.0 };
}
