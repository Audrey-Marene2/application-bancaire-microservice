// ==========================================
// src/navigation/MainNavigator.js (UPDATED)
// ==========================================
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { AccountsScreen } from '../screens/main/AccountsScreen';
import { TransactionsScreen } from '../screens/main/TransactionsScreen';
import { NotificationsScreen } from '../screens/main/NotificationsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { DepositScreen } from '../screens/transaction/DepositScreen';
import { WithdrawalScreen } from '../screens/transaction/WithdrawalScreen';
import { TransferScreen } from '../screens/transaction/TransferScreen';
import { PaymentScreen } from '../screens/transaction/PaymentScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack pour le Dashboard
const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="DashboardMain" component={DashboardScreen} />
    <Stack.Screen 
      name="Deposit" 
      component={DepositScreen}
      options={{
        headerShown: true,
        title: 'Dépôt',
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
      }}
    />
    <Stack.Screen 
      name="Withdrawal" 
      component={WithdrawalScreen}
      options={{
        headerShown: true,
        title: 'Retrait',
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
      }}
    />
    <Stack.Screen 
      name="Transfer" 
      component={TransferScreen}
      options={{
        headerShown: true,
        title: 'Virement',
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
      }}
    />
    <Stack.Screen 
      name="Payment" 
      component={PaymentScreen}
      options={{
        headerShown: true,
        title: 'Paiement',
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
      }}
    />
  </Stack.Navigator>
);

// Stack pour les Transactions
const TransactionsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="TransactionsMain" component={TransactionsScreen} />
    <Stack.Screen 
      name="Deposit" 
      component={DepositScreen}
      options={{
        headerShown: true,
        title: 'Dépôt',
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
      }}
    />
    <Stack.Screen 
      name="Withdrawal" 
      component={WithdrawalScreen}
      options={{
        headerShown: true,
        title: 'Retrait',
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
      }}
    />
    <Stack.Screen 
      name="Transfer" 
      component={TransferScreen}
      options={{
        headerShown: true,
        title: 'Virement',
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
      }}
    />
    <Stack.Screen 
      name="Payment" 
      component={PaymentScreen}
      options={{
        headerShown: true,
        title: 'Paiement',
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
      }}
    />
  </Stack.Navigator>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Accounts') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{ tabBarLabel: 'Comptes' }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsStack}
        options={{ tabBarLabel: 'Transactions' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarLabel: 'Notifications' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
};
