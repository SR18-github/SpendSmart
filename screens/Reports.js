import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactions } from '../context/TransactionContext';
import styles from '../utils/styles';

const ReportsScreen = () => {
  const { transactions } = useTransactions();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [transactionType, setTransactionType] = useState('all');
  const [amountFilter, setAmountFilter] = useState('');
  const [amountValue, setAmountValue] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const applyFilters = () => {
    const filtered = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      if (transactionDate < startDate || transactionDate > endDate) return false;
      if (transactionType !== 'all' && t.type !== transactionType) return false;
      if (amountFilter && amountValue) {
        const value = parseFloat(amountValue);
        if (isNaN(value)) return false;
        if (amountFilter === 'greater' && t.amount <= value) return false;
        if (amountFilter === 'less' && t.amount >= value) return false;
        if (amountFilter === 'equal' && t.amount !== value) return false;
      }
      if (categoryFilter !== 'all' && t.category_name !== categoryFilter) return false;    
      return true;
    });
    setFilteredTransactions(filtered);
  };

  const expenseCategories = ['All', ...new Set(transactions.filter(t => t.type === 'expense').map(t => t.category_name))];
    
  return (
    <ScrollView style={styles.container}>
        <Text style={styles.label}>Date Range:</Text>
        <Button
          title={`Start: ${startDate.toLocaleDateString()}`}
          onPress={() => setShowDatePicker('start')}
        />
        <Button
          title={`End: ${endDate.toLocaleDateString()}`}
          onPress={() => setShowDatePicker('end')}
        />

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

      <Text style={styles.label}>Transaction Type:</Text>
      <Picker
        selectedValue={transactionType}
        onValueChange={(itemValue) => setTransactionType(itemValue)}
        style={styles.picker}
        mode={'dropdown'}
      >
        <Picker.Item label="All" value="all" />
        <Picker.Item label="Income" value="income" />
        <Picker.Item label="Expense" value="expense" />
      </Picker>

      <Text style={styles.label}>Amount Filter:</Text>
      <Picker
        selectedValue={amountFilter}
        onValueChange={(itemValue) => setAmountFilter(itemValue)}
        style={styles.picker}
        mode={'dropdown'}
      >
        <Picker.Item label="None" value="" />
        <Picker.Item label="Equal to" value="equal" />
        <Picker.Item label="Greater than" value="greater" />
        <Picker.Item label="Less than" value="less" />
      </Picker>

      {amountFilter && (
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amountValue}
          onChangeText={setAmountValue}
        />
      )}

      <Text style={styles.label}>Category:</Text>
      <Picker selectedValue={categoryFilter} 
              onValueChange={setCategoryFilter}
              mode={'dropdown'}
      >
        {expenseCategories.map(category => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
      </Picker>


      <Button title="Search" onPress={applyFilters} color="#8743A2" />

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <>
              <Text style={styles.label}>Search Results</Text>
          </>
        )}
        renderItem={({ item }) => (
          <>
            {item.type === 'income' && (
              <View style={styles.listItem}>
                <Text style={styles.incomeDate}>{new Date(item.date).toLocaleDateString('en-US')}</Text>
                <Text style={[styles.incomeDescription, { fontWeight: 'bold', color: '#008000', textAlign: 'left' }]}>${item.amount.toFixed(2)}</Text>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            )}
            {item.type === 'expense' && (
              <View style={styles.listItem}>
                <Text style={styles.incomeDate}>{new Date(item.date).toLocaleDateString('en-US')}</Text>
                <Text style={[styles.incomeDescription, { fontWeight: 'bold', color: '#FF0000', textAlign: 'left' }]}>(${item.amount.toFixed(2)})</Text>
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
