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

const IncomeScreen = () => {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (loading) return;
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
        date: date.toISOString(),
        comment: comment.trim() || 'Income',
      });
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

  const incomes = transactions.filter((tx) => tx.type === 'income');

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
      <Text style={styles.label}>Amount:</Text>
      <TextInput
        placeholder="Amount ($)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        editable={!loading}
      />
      
      <Text style={styles.label}>Comment:</Text>
      <TextInput
        placeholder="Comment (max 16 chars)"
        value={comment}
        onChangeText={(text) => setComment(text.slice(0, 16))} // Limit input length
        style={styles.input}
        editable={!loading}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput} disabled={loading}>
        <Text style={styles.dateText}>Date: {date.toLocaleDateString('en-US')}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Button title="Add Income" onPress={handleSubmit} color="#8743A2" />

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
            <Text style={styles.incomeDate}>{new Date(item.date).toLocaleDateString('en-US')}</Text>
            <Text style={[styles.incomeDescription, { fontWeight: 'bold', color: '#008000' }]}>${item.amount.toFixed(2)}</Text>
            <Text style={styles.commentText}>{item.comment}</Text>
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
