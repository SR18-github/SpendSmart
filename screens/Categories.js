import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Alert, Text } from 'react-native';
import { useTransactions } from '../context/TransactionContext';
import styles from '../utils/styles';

/**
 * CategoriesScreen Component
 * - Allows users to **add and delete categories**.
 * - Uses **TransactionContext** to interact with the database.
 */
const CategoriesScreen = () => {
  // Extract categories, addCategory, and deleteCategory from context
  const { categories, addCategory, deleteCategory } = useTransactions();
  const [newCategory, setNewCategory] = useState(''); // State for the new category input

  /**
   * handleAddCategory()
   * - Validates user input.
   * - Calls **addCategory()** from context to save the category.
   * - Displays an error if the category name is empty.
   */
  const handleAddCategory = async () => {
    try {
      if (!newCategory.trim()) {
        Alert.alert('Error', 'Category name cannot be empty');
        return;
      }
      
      await addCategory(newCategory); // Adds category to the database
      setNewCategory(''); // Clears input field after successful addition
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  /**
   * handleDelete(id)
   * - Deletes a category based on the provided ID.
   * - Calls **deleteCategory()** from context.
   * - Displays an alert upon success or failure.
   * @param {number} id - ID of the category to delete.
   */
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
      {/* Input field for adding a new category */}
      <TextInput
        placeholder="New Category Name"
        value={newCategory}
        onChangeText={setNewCategory}
        style={styles.input}
      />

      {/* Button to add a new category */}
      <Button
        buttonStyle={styles.buttonStyle}
        style={{ borderRadius: 20 }}
        containerStyle={[{ width: '100%', borderRadius: 20 }]}
        titleStyle={{ fontSize: 16, fontWeight: '600' }}     
        title="Add Category"
        onPress={handleAddCategory}
        color="#8743A2"
      />

      {/* List of existing categories */}
      <FlatList
        data={categories} // Fetch categories from context
        keyExtractor={(item) => item.id.toString()} // Unique key for each category
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.categoryText}>{item.name}</Text>
            {/* Delete button for each category */}
            <Button
              title="Delete"
              onPress={() => handleDelete(item.id)}
              color="#e74c3c"
            />
          </View>
        )}
        // Display message when no categories exist
        ListEmptyComponent={
          <Text style={styles.emptyText}>No categories found</Text>
        }
      />
    </View>
  );
};

export default CategoriesScreen;
