// ==========================================
// src/components/transaction/TransactionItem.js
// ==========================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { COLORS } from '../../constants/colors';
import { formatCurrency, formatDateTime, formatTransactionType } from '../../utils/formatters';

export const TransactionItem = ({ transaction }) => {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return 'arrow-down-circle';
      case 'WITHDRAWAL':
        return 'arrow-up-circle';
      case 'TRANSFER':
        return 'swap-horizontal';
      case 'PAYMENT':
        return 'card';
      default:
        return 'cash';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return COLORS.deposit;
      case 'WITHDRAWAL':
        return COLORS.withdrawal;
      case 'TRANSFER':
        return COLORS.transfer;
      case 'PAYMENT':
        return COLORS.payment;
      default:
        return COLORS.textSecondary;
    }
  };

  const color = getTransactionColor(transaction.type);
  const isPositive = transaction.type === 'DEPOSIT';

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={getTransactionIcon(transaction.type)} size={24} color={color} />
        </View>
        
        <View style={styles.info}>
          <Text style={styles.type}>{formatTransactionType(transaction.type)}</Text>
          <Text style={styles.date}>{formatDateTime(transaction.createdAt)}</Text>
          {transaction.status === 'FAILED' && transaction.failureReason && (
            <Text style={styles.failureReason}>{transaction.failureReason}</Text>
          )}
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: isPositive ? COLORS.success : COLORS.error }]}>
            {isPositive ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  transaction.status === 'SUCCESS' ? COLORS.success + '20' : COLORS.error + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: transaction.status === 'SUCCESS' ? COLORS.success : COLORS.error,
                },
              ]}
            >
              {transaction.status === 'SUCCESS' ? 'Réussi' : 'Échoué'}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  failureReason: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});