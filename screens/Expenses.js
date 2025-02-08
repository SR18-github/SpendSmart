import React, { useState } from 'react';
import { View, TextInput, Button, Alert, FlatList, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTransactions } from '../context/TransactionContext';
import styles from '../utils/styles';

/**
 * ExpensesScreen Component
 * - Allows users to **add and delete expenses**.
 * - Uses **TransactionContext** to manage expenses and categories.
 */
const ExpensesScreen = () => {
  // Extract transactions, categories, addTransaction, and deleteTransaction from context
  const { categories = [], transactions, addTransaction, deleteTransaction } = useTransactions();
  const [amount, setAmount] = useState(''); // State for the amount input
  const [categoryId, setCategoryId] = useState(''); // State for the selected category

  /**
   * handleSubmit()
   * - Validates user input.
   * - Calls **addTransaction()** from context to save the expense.
   * - Displays an alert if the input is invalid.
   */
  const handleSubmit = async () => {
    try {
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        Alert.alert('Error', 'Please enter a valid amount');
        return;
      }
      if (!categoryId) {
        Alert.alert('Error', 'Please select a category');
        return;
      }

      await addTransaction({
        type: 'expense',
        amount: parseFloat(amount),
        category_id: parseInt(categoryId),
      });

      setAmount(''); // Clear input fields after successful submission
      setCategoryId('');
      Alert.alert('Success', 'Expense added successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  /**
   * confirmDelete(expenseId)
   * - Displays a confirmation dialog before deleting an expense.
   * - Calls **handleDelete()** if the user confirms.
   * @param {number} expenseId - ID of the expense to delete.
   */
  const confirmDelete = (expenseId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(expenseId) },
      ]
    );
  };

  /**
   * handleDelete(expenseId)
   * - Deletes an expense from the database and refreshes state.
   * - Calls **deleteTransaction()** from context.
   * @param {number} expenseId - ID of the expense to delete.
   */
  const handleDelete = async (expenseId) => {
    try {
      await deleteTransaction(expenseId);
      Alert.alert('Success', 'Expense deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Input for expense amount */}
      <Text style={styles.label}>Amount:</Text>
      <TextInput
        placeholder="Amount ($)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      {/* Dropdown for selecting expense category */}
      <Text style={styles.label}>Category:</Text>
      <Picker
        selectedValue={categoryId}
        onValueChange={setCategoryId}
        mode={'dropdown'}
      >
        {(categories || []).map(category => (
          <Picker.Item key={category.id} label={category.name} value={category.id.toString()} />
        ))}
      </Picker>

      {/* Button to add expense */}
      <Button title="Add Expense" onPress={handleSubmit} color="#8743A2" />

      {/* List of recorded expenses */}
      <FlatList
        data={[...transactions].filter(t => t.type === 'expense').sort((a, b) => new Date(b.date) - new Date(a.date))}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <>
            <Text style={styles.label}></Text>                 
            <Text style={styles.label}>List of last 50 expenses items</Text>
          </>
        )}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {/* Expense Date and Amount */}
            <Text style={styles.transactionText}>
              {new Date(item.date).toLocaleDateString('en-US')} -  
              <Text style={{ fontWeight: 'bold', color: 'red' }}> (${item.amount.toFixed(2)})</Text>
            </Text>
            {/* Expense Category */}
            <Text style={styles.categoryText}>{item.category_name || 'Uncategorized'}</Text>
            {/* Delete Button for Each Expense */}
            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
              <Button title="Delete" onPress={() => confirmDelete(item.id)} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
        // Display message if no expenses exist
        ListEmptyComponent={<Text style={styles.emptyText}>No expenses found</Text>}
      />
    </ScrollView>
  );
};

export default ExpensesScreen;
