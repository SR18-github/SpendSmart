import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

const DB_NAME = 'spendsmart.db';
const DB_PATH = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

export async function loadDatabase() {
  try {
    const fileInfo = await FileSystem.getInfoAsync(DB_PATH);
    
    if (!fileInfo.exists) {
      console.log('Database not found, copying from assets...');
      
      const asset = Asset.fromModule(require('./assets/database/spendsmart.db'));
      await FileSystem.copyAsync({
        from: asset.uri,
        to: DB_PATH
      });

      console.log('Database copied successfully.');
    } else {
      console.log('Database already exists.');
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
}

export async function initializeDatabase() {
  try {
    console.log('Opening database...');
    const db = await SQLite.openDatabaseAsync(DB_NAME);

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT CHECK(type IN ('income', 'expense')),
          amount REAL NOT NULL,
          category_id INTEGER,
          date TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
          comment TEXT
      );

      CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL
      );
    `);

    const result = await db.getFirstAsync('SELECT COUNT(*) AS count FROM categories');

    if (result?.count === 0) {
      await db.runAsync(`
        INSERT INTO categories (name) VALUES
            ('Tuition fees'),
            ('Housing'),
            ('Food and drinks'),
            ('Transportation'),
            ('Books/Stationary'),
            ('Utilities'),
            ('Laundry'),
            ('Entertainment'),
            ('Personal'),
            ('Credit card bill');
      `);
      console.log('Default categories added.');
    }

    console.log('Database initialized successfully.');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function useDatabase() {
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  return {
    getTransactions: async () => {
      return await db.getAllAsync(`
        SELECT t.*, c.name AS category_name 
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        ORDER BY date DESC
      `);
    },

    getAllCategories: async () => {
      return await db.getAllAsync(`SELECT * FROM categories`);
    },

    addTransaction: async (transaction) => {
      if (!transaction.amount || isNaN(transaction.amount)) {
        throw new Error('Invalid amount');
      }

      await db.runAsync(
        `INSERT INTO transactions (type, amount, category_id, date, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [
          transaction.type,
          transaction.amount,
          transaction.category_id || null,
          transaction.date || new Date().toISOString(),  
          transaction.comment || 'Income'
        ]
      );
    },

    deleteTransaction: async (transactionId) => {
      if (!transactionId) {
        throw new Error("Invalid transaction ID.");
      }
      await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [transactionId]);
    },

    deleteCategory: async (categoryId) => {
      const result = await db.getFirstAsync(
        `SELECT COUNT(*) AS count FROM transactions WHERE category_id = ?`,
        [categoryId]
      );

      if (result?.count && result.count > 0) {
        throw new Error('Category is used in existing transactions');
      }

      await db.runAsync(`DELETE FROM categories WHERE id = ?`, [categoryId]);
    },

    addCategory: async (categoryName) => {
      if (!categoryName || categoryName.trim() === '') {
        throw new Error('Category name cannot be empty.');
      }
          
      const result = await db.getFirstAsync(
        `SELECT COUNT(*) AS count FROM categories WHERE name = ?`,
        [categoryName]
      );

      if (result?.count && result.count > 0) {
        throw new Error('There is already a category with the same name.');
      }
          
      await db.runAsync(`INSERT INTO categories (name) VALUES (?)`, [categoryName]);
    }
  };
}
