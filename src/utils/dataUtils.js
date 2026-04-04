/**
 * Get the last n months of income and expense data from transactions
 * @param {Array} transactions 
 * @param {number} n 
 * @returns {Array} Array of objects { key, label, income, expense, year }
 */
export const getLastNMonthsData = (transactions, n = 6) => {
  if (!transactions || transactions.length === 0) return [];

  // Find the latest date in transactions to determine the end of our range
  let maxDateStr = '';
  transactions.forEach(t => {
    if (t.date > maxDateStr) maxDateStr = t.date;
  });

  if (!maxDateStr) return [];

  const [maxYearStr, maxMonthStr] = maxDateStr.split('-');
  let maxYear = parseInt(maxYearStr, 10);
  let maxMonthIdx = parseInt(maxMonthStr, 10) - 1;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    let m = maxMonthIdx - i;
    let y = maxYear;
    while (m < 0) {
      m += 12;
      y -= 1;
    }
    months.push({
      key: `${y}-${String(m + 1).padStart(2, '0')}`,
      label: monthNames[m],
      income: 0,
      expense: 0,
      year: y
    });
  }

  transactions.forEach(t => {
    // Only take YYYY-MM
    const key = t.date.substring(0, 7);
    const targetMonth = months.find(m => m.key === key);
    if (targetMonth) {
      if (t.type === 'income') {
        targetMonth.income += Math.abs(t.amount);
      } else if (t.type === 'expense') {
        targetMonth.expense += Math.abs(t.amount);
      }
    }
  });

  return months;
};
