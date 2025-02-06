import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Alert, Text } from 'react-native';
import { useTransactions } from '../context/TransactionContext';
import styles from '../utils/styles';

const CategoriesScreen = () => {
  // Now include addCategory and deleteCategory from context
  const { categories, addCategory, deleteCategory } = useTransactions();
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = async () => {
    try {
      if (!newCategory.trim()) {
        Alert.alert('Error', 'Category name cannot be empty');
        return;
      }
      
      // Call the addCategory function from the context
      await addCategory(newCategory);
      setNewCategory('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      Alert.alert('Success', 'Category deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="New Category Name"
        value={newCategory}
        onChangeText={setNewCategory}
        style={styles.input}
      />
      <Button
        buttonStyle={styles.buttonStyle}
        style={{ borderRadius: 20 }}
        containerStyle={[{ width: '100%', borderRadius: 20 }]}
        titleStyle={{ fontSize: 16, fontWeight: '600' }}     
        title="Add Category"
        onPress={handleAddCategory}
        color="#8743A2"
      />

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.categoryText}>{item.name}</Text>
            <Button
              title="Delete"
              onPress={() => handleDelete(item.id)}
              color="#e74c3c"
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No categories found</Text>
        }
      />
    </View>
  );
};

export default CategoriesScreen;
