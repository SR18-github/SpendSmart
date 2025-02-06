import React, { useState } from 'react';
import { View, TextInput, Button, Alert, FlatList, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTransactions } from '../context/TransactionContext';
import styles from '../utils/styles';

const ExpensesScreen = () => {
  const { categories = [], transactions, addTransaction, deleteTransaction } = useTransactions();
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');

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

      setAmount('');
      setCategoryId('');
      Alert.alert('Success', 'Expense added successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

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
      <Text style={styles.label}>Amount:</Text>
      <TextInput
        placeholder="Amount ($)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

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

      <Button title="Add Expense" onPress={handleSubmit} color="#8743A2" />

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
            <Text style={styles.transactionText}>
              {new Date(item.date).toLocaleDateString('en-US')} -  
              <Text style={{ fontWeight: 'bold', color: 'red' }}>(${item.amount.toFixed(2)})</Text>
            </Text>
            <Text style={styles.categoryText}>{item.category_name || 'Uncategorized'}</Text>
            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
              <Button title="Delete" onPress={() => confirmDelete(item.id)} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No expenses found</Text>}
      />
    </ScrollView>
  );
};

export default ExpensesScreen;
