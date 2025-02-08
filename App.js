import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { loadDatabase, initializeDatabase, useDatabase } from './database';
import { TransactionProvider } from './context/TransactionContext';
import DashboardScreen from './screens/Dashboard';
import CategoriesScreen from './screens/Categories';
import IncomeScreen from './screens/Income';
import ExpensesScreen from './screens/Expenses';
import ReportsScreen from './screens/Reports';

// Create a bottom tab navigator for app navigation
const Tab = createBottomTabNavigator();

/**
 * DatabaseWrapper Component
 * Wraps all main screens inside a tab navigation system and passes the database instance as a prop.
 * Ensures that each screen has access to the database for fetching and modifying transaction data.
 */
function DatabaseWrapper({ db }) {
    return (
        <Tab.Navigator 
            screenOptions={{
                tabBarActiveTintColor: '#8743A2', // Sets active tab color
                tabBarLabelStyle: { fontWeight: 'bold', textAlign: 'center' } // Styles tab labels
            }}        
        >
            {/* Define tabs for different sections of the app */}
            <Tab.Screen name="Dashboard">
                {(props) => <DashboardScreen {...props} db={db} />}
            </Tab.Screen>
            <Tab.Screen name="Income">
                {(props) => <IncomeScreen {...props} db={db} />}
            </Tab.Screen>
            <Tab.Screen name="Expenses">
                {(props) => <ExpensesScreen {...props} db={db} />}
            </Tab.Screen>
            <Tab.Screen name="Reports">
                {(props) => <ReportsScreen {...props} db={db} />}
            </Tab.Screen>
            <Tab.Screen name="Categories">
                {(props) => <CategoriesScreen {...props} db={db} />}
            </Tab.Screen>    
        </Tab.Navigator>
    );
}

export default function App() {
    // State to hold the database instance
    const [db, setDb] = useState(null);
    const [dbReady, setDbReady] = useState(false); // Tracks whether the database is ready

    /**
     * useEffect Hook
     * Runs once when the app starts to initialize the database.
     * Calls `loadDatabase()` and `initializeDatabase()` to set up storage.
     */
    useEffect(() => {
        const init = async () => {
            try {
                await loadDatabase(); // Ensures the database file is available
                const database = await initializeDatabase(); // Initializes tables and default values
                setDb(database); // Stores the database instance in state
                setDbReady(true); // Marks the database as ready
            } catch (error) {
                console.error('Database initialization failed:', error);
            }
        };
        
        init();
    }, []);

    /**
     * Displays a loading screen until the database is ready.
     * Prevents users from interacting with the app before data is initialized.
     */
    if (!dbReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Initializing database...</Text>
            </View>
        );
    }

    /**
     * Main Application Structure
     * Wraps the navigation inside the TransactionProvider to provide transaction context globally.
     */
    return (
        <TransactionProvider> {/* Provides transaction data to all components */}
            <NavigationContainer> {/* Handles app navigation */}
                <DatabaseWrapper db={db} />
            </NavigationContainer>
        </TransactionProvider>
    );
}
