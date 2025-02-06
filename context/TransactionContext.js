import React, { createContext, useContext, useState, useEffect } from 'react';
import { Text } from 'react-native';
import { useDatabase } from '../database';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [db, setDb] = useState(null);
  const [dbError, setDbError] = useState(null);

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
        setDbError(error.message);
      }
    };
    
    fetchDatabase();
  }, []);

  const loadTransactions = async (database) => {
    if (!database) return;
    const data = await database.getTransactions();
    setTransactions(data || []);
  };

  const loadCategories = async (database) => {
    if (!database) return;
    const data = await database.getAllCategories();
    setCategories(data || []);
  };

  const addTransaction = async (transaction) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }
    await db.addTransaction(transaction);
    loadTransactions(db);
  };

  const deleteTransaction = async (transactionId) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }
    await db.deleteTransaction(transactionId);
    loadTransactions(db);
  };

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

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    console.error("Error: useTransactions must be used within a TransactionProvider.");
    return { transactions: [], addTransaction: async () => {}, deleteTransaction: async () => {} };
  }
  return context;
};
