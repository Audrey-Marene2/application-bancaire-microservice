// ==========================================
// src/navigation/TransactionNavigator.js
// ==========================================
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DepositScreen } from '../screens/transaction/DepositScreen';
import { WithdrawalScreen } from '../screens/transaction/WithdrawalScreen';
import { TransferScreen } from '../screens/transaction/TransferScreen';
import { PaymentScreen } from '../screens/transaction/PaymentScreen';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator();

export const TransactionNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Deposit"
        component={DepositScreen}
        options={{
          title: 'Dépôt',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Withdrawal"
        component={WithdrawalScreen}
        options={{
          title: 'Retrait',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Transfer"
        component={TransferScreen}
        options={{
          title: 'Virement',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          title: 'Paiement',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};