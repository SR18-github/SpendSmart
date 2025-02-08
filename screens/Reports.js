import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactions } from '../context/TransactionContext';
import styles from '../utils/styles';

/**
 * ReportsScreen Component
 * - Allows users to filter transactions based on **date range, type, amount, and category**.
 * - Uses **TransactionContext** to access transactions.
 */
const ReportsScreen = () => {
  const { transactions } = useTransactions();
  const [startDate, setStartDate] = useState(new Date()); // Start date filter
  const [endDate, setEndDate] = useState(new Date()); // End date filter
  const [showDatePicker, setShowDatePicker] = useState(null); // Date picker visibility
  const [transactionType, setTransactionType] = useState('all'); // Filter for transaction type
  const [amountFilter, setAmountFilter] = useState(''); // Filter for amount condition
  const [amountValue, setAmountValue] = useState(''); // Filter for amount value
  const [categoryFilter, setCategoryFilter] = useState('all'); // Filter for expense category
  const [filteredTransactions, setFilteredTransactions] = useState([]); // State for search results

  /**
   * applyFilters()
   * - Filters transactions based on **date range, transaction type, amount filter, and category**.
   */
  const applyFilters = () => {
    const filtered = transactions.filter(t => {
      const transactionDate = new Date(t.date);

      // Check Date Range
      if (transactionDate < startDate || transactionDate > endDate) return false;

      // Filter by Transaction Type (Income, Expense, or All)
      if (transactionType !== 'all' && t.type !== transactionType) return false;

      // Filter by Amount Condition (Equal to, Greater than, Less than)
      if (amountFilter && amountValue) {
        const value = parseFloat(amountValue);
        if (isNaN(value)) return false;
        if (amountFilter === 'greater' && t.amount <= value) return false;
        if (amountFilter === 'less' && t.amount >= value) return false;
        if (amountFilter === 'equal' && t.amount !== value) return false;
      }

      // Filter by Expense Category
      if (categoryFilter !== 'all' && t.category_name !== categoryFilter) return false;

      return true;
    });

    setFilteredTransactions(filtered);
  };

  // Generate category dropdown values (Only expense categories)
  const expenseCategories = ['All', ...new Set(transactions.filter(t => t.type === 'expense').map(t => t.category_name))];

  return (
    <ScrollView style={styles.container}>
      {/* Date Range Selection */}
      <Text style={styles.label}>Date Range:</Text>
      <Button title={`Start: ${startDate.toLocaleDateString()}`} onPress={() => setShowDatePicker('start')} />
      <Button title={`End: ${endDate.toLocaleDateString()}`} onPress={() => setShowDatePicker('end')} />

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={showDatePicker === 'start' ? startDate : endDate}
          mode="date"
          onChange={(event, date) => {
            setShowDatePicker(null);
            date && (showDatePicker === 'start' ? setStartDate(date) : setEndDate(date));
          }}
        />
      )}

      {/* Transaction Type Filter */}
      <Text style={styles.label}>Transaction Type:</Text>
      <Picker selectedValue={transactionType} onValueChange={(itemValue) => setTransactionType(itemValue)} mode={'dropdown'}>
        <Picker.Item label="All" value="all" />
        <Picker.Item label="Income" value="income" />
        <Picker.Item label="Expense" value="expense" />
      </Picker>

      {/* Amount Filter */}
      <Text style={styles.label}>Amount Filter:</Text>
      <Picker selectedValue={amountFilter} onValueChange={(itemValue) => setAmountFilter(itemValue)} mode={'dropdown'}>
        <Picker.Item label="None" value="" />
        <Picker.Item label="Equal to" value="equal" />
        <Picker.Item label="Greater than" value="greater" />
        <Picker.Item label="Less than" value="less" />
      </Picker>

      {/* Amount Input (Only visible if an amount filter is selected) */}
      {amountFilter && (
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amountValue}
          onChangeText={setAmountValue}
        />
      )}

      {/* Category Filter (Only for Expenses) */}
      <Text style={styles.label}>Category:</Text>
      <Picker selectedValue={categoryFilter} onValueChange={setCategoryFilter} mode={'dropdown'}>
        {expenseCategories.map(category => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
      </Picker>

      {/* Search Button */}
      <Button title="Search" onPress={applyFilters} color="#8743A2" />

      {/* Display Filtered Transactions */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => <Text style={styles.label}>Search Results</Text>}
        renderItem={({ item }) => (
          <>
            {/* Display Income Transactions */}
            {item.type === 'income' && (
              <View style={styles.listItem}>
                <Text style={styles.incomeDate}>{new Date(item.date).toLocaleDateString('en-US')}</Text>
                <Text style={[styles.incomeDescription, { fontWeight: 'bold', color: '#008000', textAlign: 'left' }]}>
                  ${item.amount.toFixed(2)}
                </Text>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            )}
            {/* Display Expense Transactions */}
            {item.type === 'expense' && (
              <View style={styles.listItem}>
                <Text style={styles.incomeDate}>{new Date(item.date).toLocaleDateString('en-US')}</Text>
                <Text style={[styles.incomeDescription, { fontWeight: 'bold', color: '#FF0000', textAlign: 'left' }]}>
                  (${item.amount.toFixed(2)})
                </Text>
                <Text style={styles.commentText}>{item.category_name}</Text>
              </View>
            )}
          </>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
      />
    </ScrollView>
  );
};

export default ReportsScreen;
