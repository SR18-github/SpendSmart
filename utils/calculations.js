export const getBalance = (transactions) => {
  return transactions.reduce((total, t) => 
    t.type === 'income' ? total + t.amount : total - t.amount
  , 0);
};

export const getPeriodComparison = (transactions, periodDays) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - periodDays);

  const periodTransactions = transactions.filter(t => 
    new Date(t.date) >= cutoffDate
  );

  const income = periodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return { income, expenses, difference: income - expenses };
};