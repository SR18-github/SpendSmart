/**
 * Calculates the total balance by summing up income and subtracting expenses.
 * @param {Array} transactions - The list of transactions containing type and amount.
 * @returns {number} - The total balance (positive for net income, negative for deficit).
 */
export const getBalance = (transactions) => {
  return transactions.reduce((total, t) => 
    t.type === 'income' ? total + t.amount : total - t.amount
  , 0);
};

/**
 * Calculates the income and expenses over a specified period.
 * @param {Array} transactions - The list of transactions with date, type, and amount.
 * @param {number} periodDays - The number of days to look back for transactions.
 * @returns {Object} - An object containing:
 *   - income: Total income over the period
 *   - expenses: Total expenses over the period
 *   - difference: Net balance (income - expenses)
 */
export const getPeriodComparison = (transactions, periodDays) => {
  // Calculate the date cutoff for the specified period
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - periodDays);

  // Filter transactions that fall within the specified date range
  const periodTransactions = transactions.filter(t => 
    new Date(t.date) >= cutoffDate
  );

  // Calculate total income in the given period
  const income = periodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total expenses in the given period
  const expenses = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Return the summarized financial data for the period
  return { income, expenses, difference: income - expenses };
};
