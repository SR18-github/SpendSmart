import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTransactions } from '../context/TransactionContext';
import { getBalance, getPeriodComparison } from '../utils/calculations';
import styles from '../utils/styles';

const categoryColors = {
  "Tuition and fees": "#3498db",
  "Food and beverages": "#e74c3c",
  "Housing": "#f1c40f",
  "Transportation": "#9b59b6",
  "Books and stationary": "#2ecc71",
  "Utilities": "#e67e22",
  "Laundry": "#1abc9c",
  "Entertainment": "#8e44ad",
  "Personal expenses": "#d35400",
  "Credit card bill": "#16a085",
};

const getCategoryColor = (category) => {
  return categoryColors[category] || `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const DashboardScreen = () => {
  const { transactions = [] } = useTransactions(); // Ensure transactions is always an array
  const balance = getBalance(transactions);
  const weekly = getPeriodComparison(transactions, 7);
  const monthly = getPeriodComparison(transactions, 30);

  return (
    <ScrollView style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Balance: ${balance.toFixed(2)}
      </Text>

      <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>Weekly Summary</Text>
        <Text>Income: ${weekly.income.toFixed(2)}</Text>
        <Text>Expenses: ${weekly.expenses.toFixed(2)}</Text>
        <Text style={{ color: weekly.difference >= 0 ? '#2ecc71' : '#e74c3c' }}>
          Net: ${Math.abs(weekly.difference).toFixed(2)} {weekly.difference >= 0 ? 'Surplus' : 'Deficit'}
        </Text>
      </View>

      {/* Ensure transactions exist before rendering Pie Chart */}
      {transactions.length > 0 ? (
        <PieChart
          data={transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
              const category = t.category_name || 'Uncategorized';
              const existing = acc.find(item => item.name === category);
              if (existing) {
                existing.amount += t.amount;
              } else {
                acc.push({
                  name: category,
                  amount: t.amount,
                  color: getCategoryColor(category),
                  legendFontColor: '#7F7F7F',
                  legendFontSize: 12
                });
              }
              return acc;
            }, [])}
          width={300}
          height={200}
          chartConfig={{
            decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
          }}
          accessor="amount"
          style={styles.chart}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
          No expense data available
        </Text>
      )}
    </ScrollView>
  );
};

export default DashboardScreen;
