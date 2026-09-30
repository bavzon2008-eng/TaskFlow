const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const startOfToday = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
export const daysOverdue = (t) => {
  if (!t.due_date || t.status === 'Completed') return 0;
  return Math.max(0, Math.round((startOfToday() - parse(t.due_date)) / 86400000));
};
export const isOverdue = (t) => daysOverdue(t) > 0;
export const fmtDate = (s) =>
  s ? parse(s.slice(0, 10)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No due date';
export const fmtCreated = (s) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
