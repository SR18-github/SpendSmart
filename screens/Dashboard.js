import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTransactions } from '../context/TransactionContext';
import { getBalance, getPeriodComparison } from '../utils/calculations';
import styles from '../utils/styles';

/**
 * Category Colors Mapping
 * - Defines a fixed color scheme for each expense category.
 * - Ensures consistency in the pie chart instead of using random colors.
 */
const categoryColors = {
  "Tuition fees": "#3498db",
  "Food and drinks": "#e74c3c",
  "Housing": "#f1c40f",
  "Transportation": "#9b59b6",
  "Books/Stationary": "#2ecc71",
  "Utilities": "#e67e22",
  "Laundry": "#1abc9c",
  "Entertainment": "#8e44ad",
  "Personal": "#d35400",
  "Credit card bill": "#16a085",
};

/**
 * getCategoryColor(category)
 * - Returns a predefined color for a category.
 * - If the category does not have a predefined color, a random color is assigned.
 * @param {string} category - Name of the expense category.
 * @returns {string} - Hex color code.
 */
const getCategoryColor = (category) => {
  return categoryColors[category] || `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

/**
 * DashboardScreen Component
 * - Displays financial summaries, including **balance, weekly & monthly summaries**.
 * - Shows a **pie chart** for expenses categorized by type.
 * - Fetches transaction data using **TransactionContext**.
 */
const DashboardScreen = () => {
  const { transactions = [] } = useTransactions(); // Ensure transactions is always an array
  const balance = getBalance(transactions); // Calculate current balance
  const weekly = getPeriodComparison(transactions, 7); // Weekly financial summary
  const monthly = getPeriodComparison(transactions, 30); // Monthly financial summary

  return (
    <ScrollView style={styles.container}>
      {/* Displays current balance */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Balance: ${balance.toFixed(2)}
      </Text>

      {/* Weekly Financial Summary */}
      <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>Weekly Summary</Text>
        <Text>Income: ${weekly.income.toFixed(2)}</Text>
        <Text>Expenses: ${weekly.expenses.toFixed(2)}</Text>
        <Text style={{ color: weekly.difference >= 0 ? '#2ecc71' : '#e74c3c' }}>
          Net: ${Math.abs(weekly.difference).toFixed(2)} {weekly.difference >= 0 ? 'Surplus' : 'Deficit'}
        </Text>
      </View>

      {/* Pie Chart - Shows Expense Distribution by Category */}
      {transactions.length > 0 ? (
        <PieChart
          data={transactions
            .filter(t => t.type === 'expense') // Filter only expenses
            .reduce((acc, t) => {
              const category = t.category_name || 'Uncategorized';
              const existing = acc.find(item => item.name === category);
              if (existing) {
                existing.amount += t.amount;
              } else {
                acc.push({
                  name: category,
                  amount: t.amount,
                  color: getCategoryColor(category), // Assigns color from function
                  legendFontColor: '#7F7F7F',
                  legendFontSize: 12
                });
              }
              return acc;
            }, [])}
          width={300} // Chart width
          height={200} // Chart height
          chartConfig={{
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Pie chart color styling
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
          }}
          accessor="amount" // Data key for values
          style={styles.chart}
        />
      ) : (
        // Display message when no expense data is available
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
          No expense data available
        </Text>
      )}
    </ScrollView>
  );
};

export default DashboardScreen;
