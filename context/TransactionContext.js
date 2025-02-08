import React, { createContext, useContext, useState, useEffect } from 'react';
import { Text } from 'react-native';
import { useDatabase } from '../database';

// Create a React Context to manage transactions and categories globally
const TransactionContext = createContext();

/**
 * TransactionProvider Component
 * This component wraps around the application and provides:
 * - **State management** for transactions and categories.
 * - **Database operations** such as fetching, adding, and deleting data.
 */
export const TransactionProvider = ({ children }) => {
  // State to store transactions and categories
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [db, setDb] = useState(null); // Holds the database instance
  const [dbError, setDbError] = useState(null); // Stores database errors

  /**
   * useEffect Hook
   * Runs once when the app starts.
   * - Initializes the database.
   * - Loads transactions and categories.
   */
  useEffect(() => {
    const fetchDatabase = async () => {
      try {
        const database = await useDatabase();
        if (!database || typeof database !== 'object') {
          throw new Error("Database not initialized correctly.");
        }
        setDb(database);
        loadTransactions(database);
        loadCategories(database);
      } catch (error) {
        console.error("Database initialization failed:", error);
        setDbError(error.message); // Store error to display in UI
      }
    };
    
    fetchDatabase();
  }, []);

  /**
   * loadTransactions(database)
   * Fetches all transactions from the database and updates state.
   * @param {Object} database - SQLite database instance.
   */
  const loadTransactions = async (database) => {
    if (!database) return;
    const data = await database.getTransactions();
    setTransactions(data || []); // Ensure an empty array if no data
  };

  /**
   * loadCategories(database)
   * Fetches all categories from the database and updates state.
   * @param {Object} database - SQLite database instance.
   */
  const loadCategories = async (database) => {
    if (!database) return;
    const data = await database.getAllCategories();
    setCategories(data || []);
  };

  /**
   * addTransaction(transaction)
   * Adds a new transaction to the database and refreshes state.
   * @param {Object} transaction - Transaction details.
   */
  const addTransaction = async (transaction) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }
    await db.addTransaction(transaction);
    loadTransactions(db);
  };

  /**
   * deleteTransaction(transactionId)
   * Deletes a transaction from the database and refreshes state.
   * @param {number} transactionId - ID of the transaction to delete.
   */
  const deleteTransaction = async (transactionId) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }
    await db.deleteTransaction(transactionId);
    loadTransactions(db);
  };

  /**
   * addCategory(categoryName)
   * Adds a new category to the database and refreshes state.
   * @param {string} categoryName - Name of the category.
   */
  const addCategory = async (categoryName) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }
    try {
      await db.addCategory(categoryName);
      loadCategories(db);
    } catch (error) {
      console.error("Failed to add category:", error);
      throw error;
    }
  };

  /**
   * deleteCategory(id)
   * Deletes a category from the database if it's not associated with transactions.
   * @param {number} id - ID of the category to delete.
   */
  const deleteCategory = async (id) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }
    try {
      await db.deleteCategory(id);
      loadCategories(db);
    } catch (error) {
      console.error("Failed to delete category:", error);
      throw error;
    }
  };

  // If a database error occurs, display it on the screen
  if (dbError) {
    return <Text style={{ color: 'red', padding: 10 }}>{dbError}</Text>;
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        deleteTransaction,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

/**
 * useTransactions()
 * Custom hook to access transaction data anywhere in the app.
 * - Ensures it is used within `TransactionProvider`.
 * - Provides transactions, categories, and database actions.
 * 
 * @returns {Object} Context values including transactions and category functions.
 */
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    console.error("Error: useTransactions must be used within a TransactionProvider.");
    return { transactions: [], addTransaction: async () => {}, deleteTransaction: async () => {} };
  }
  return context;
};
