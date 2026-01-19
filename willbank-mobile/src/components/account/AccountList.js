// ==========================================
// src/components/account/AccountList.js
// ==========================================
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AccountCard } from './AccountCard';
import { COLORS } from '../../constants/colors';

export const AccountList = ({ accounts, onAccountPress, emptyMessage }) => {
  if (!accounts || accounts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {emptyMessage || 'Aucun compte disponible'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={accounts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <AccountCard account={item} onPress={() => onAccountPress(item)} />
      )}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
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