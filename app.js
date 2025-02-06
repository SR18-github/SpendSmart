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

const Tab = createBottomTabNavigator();

function DatabaseWrapper({ db }) {
    return (
        <Tab.Navigator 
screenOptions={{
            tabBarActiveTintColor: '#8743A2',
            tabBarLabelStyle: { fontWeight: 'bold', textAlign: 'center' },
          }}        
        >
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
    const [db, setDb] = useState(null);
    const [dbReady, setDbReady] = useState(false);
    
    useEffect(() => {
        const init = async () => {
            try {
                await loadDatabase();    
                const database = await initializeDatabase();
                setDb(database);
                setDbReady(true);
            } catch (error) {
                console.error('Database initialization failed:', error);
            }
        };
        
        init();
    }, []);

    if (!dbReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Initializing database...</Text>
            </View>
        );
    }

    return (
        <TransactionProvider> {}
            <NavigationContainer>
                <DatabaseWrapper db={db} />
            </NavigationContainer>
        </TransactionProvider>
    );
}
