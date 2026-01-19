// ==========================================
// src/components/account/AccountCard.js
// ==========================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { COLORS } from '../../constants/colors';
import { formatCurrency, formatAccountType, maskAccountNumber } from '../../utils/formatters';

export const AccountCard = ({ account, onPress }) => {
  const accountColor = account.type === 'CURRENT' ? COLORS.current : COLORS.savings;

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: accountColor + '20' }]}>
          <Ionicons 
            name={account.type === 'CURRENT' ? 'card' : 'wallet'} 
            size={24} 
            color={accountColor} 
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.accountType}>{formatAccountType(account.type)}</Text>
          <Text style={styles.accountNumber}>{maskAccountNumber(account.id)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Solde disponible</Text>
        <Text style={styles.balance}>{formatCurrency(account.balance)}</Text>
      </View>

      <View style={styles.footer}>
        <View style={[styles.statusBadge, { 
          backgroundColor: account.status === 'ACTIVE' ? COLORS.success + '20' : COLORS.error + '20' 
        }]}>
          <Text style={[styles.statusText, {
            color: account.status === 'ACTIVE' ? COLORS.success : COLORS.error
          }]}>
            {account.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  accountType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  accountNumber: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  balanceContainer: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
