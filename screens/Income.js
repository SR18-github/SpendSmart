import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Button,    
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactions } from '../context/TransactionContext';
import styles from '../utils/styles';

/**
 * IncomeScreen Component
 * - Allows users to **add and delete income transactions**.
 * - Uses **TransactionContext** to manage transactions.
 */
const IncomeScreen = () => {
  // Extract transactions, addTransaction, and deleteTransaction from context
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [amount, setAmount] = useState(''); // State for amount input
  const [comment, setComment] = useState(''); // State for comment input
  const [date, setDate] = useState(new Date()); // State for selected date
  const [showDatePicker, setShowDatePicker] = useState(false); // State for date picker visibility
  const [loading, setLoading] = useState(false); // State for form submission loading indicator

  /**
   * handleDateChange()
   * - Updates the selected date.
   * - Closes the date picker on **Android** after selection.
   * @param {object} event - The event triggered by DatePicker.
   * @param {Date} selectedDate - The selected date.
   */
  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false); // Close picker on Android
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  /**
   * handleSubmit()
   * - Validates user input.
   * - Calls **addTransaction()** from context to save the income.
   * - Displays an alert if the input is invalid.
   */
  const handleSubmit = useCallback(async () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true);
    try {
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        Alert.alert('Error', 'Please enter a valid amount');
        setLoading(false);
        return;
      }
      if (comment.length > 16) {
        Alert.alert('Error', 'Comment must be 16 characters or less');
        setLoading(false);
        return;
      }
      await addTransaction({
        type: 'income',
        amount: parseFloat(amount),
        date: date.toISOString(), // Store date in ISO format
        comment: comment.trim() || 'Income', // Default comment
      });
      // Clear input fields after successful addition
      setAmount('');
      setComment('');
      setDate(new Date());
      Alert.alert('Success', 'Income added successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }, [amount, date, comment, loading, addTransaction]);

  // Filter only income transactions from all transactions
  const incomes = transactions.filter((tx) => tx.type === 'income');

  /**
   * confirmDelete(incomeId)
   * - Displays a confirmation dialog before deleting an income.
   * - Calls **handleDelete()** if the user confirms.
   * @param {number} incomeId - ID of the income to delete.
   */
  const confirmDelete = (incomeId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this income?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(incomeId) },
      ]
    );
  };

  /**
   * handleDelete(incomeId)
   * - Deletes an income transaction from the database.
   * - Calls **deleteTransaction()** from context.
   * @param {number} incomeId - ID of the income to delete.
   */
  const handleDelete = async (incomeId) => {
    try {
      await deleteTransaction(incomeId);
      Alert.alert('Success', 'Income deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Amount Input */}
      <Text style={styles.label}>Amount:</Text>
      <TextInput
        placeholder="Amount ($)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        editable={!loading}
      />
      
      {/* Comment Input */}
      <Text style={styles.label}>Comment:</Text>
      <TextInput
        placeholder="Comment (max 16 chars)"
        value={comment}
        onChangeText={(text) => setComment(text.slice(0, 16))} // Limit input length
        style={styles.input}
        editable={!loading}
      />

      {/* Date Input */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput} disabled={loading}>
        <Text style={styles.dateText}>Date: {date.toLocaleDateString('en-US')}</Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Add Income Button */}
      <Button title="Add Income" onPress={handleSubmit} color="#8743A2" />

      {/* List of Incomes */}
      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <>
              <Text style={styles.label}></Text>                 
              <Text style={styles.label}>List of last 50 incomes items</Text>
          </>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No incomes added</Text>}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {/* Display Income Date */}
            <Text style={styles.incomeDate}>{new Date(item.date).toLocaleDateString('en-US')}</Text>
            {/* Display Income Amount in Green */}
            <Text style={[styles.incomeDescription, { fontWeight: 'bold', color: '#008000' }]}>
              ${item.amount.toFixed(2)}
            </Text>
            {/* Display Comment Instead of 'Income' */}
            <Text style={styles.commentText}>{item.comment}</Text>
            {/* Delete Button */}
            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
              <Button title="Delete" onPress={() => confirmDelete(item.id)} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default IncomeScreen;
