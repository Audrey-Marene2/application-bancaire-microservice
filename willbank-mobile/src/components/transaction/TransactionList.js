// ==========================================
// src/components/transaction/TransactionList.js
// ==========================================
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TransactionItem } from './TransactionItem';
import { COLORS } from '../../constants/colors';

export const TransactionList = ({ transactions, emptyMessage }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {emptyMessage || 'Aucune transaction'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
