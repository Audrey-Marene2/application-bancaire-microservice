// ==========================================
// src/components/notification/NotificationList.js
// ==========================================
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NotificationItem } from './NotificationItem';
import { COLORS } from '../../constants/colors';

export const NotificationList = ({ notifications, emptyMessage }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {emptyMessage || 'Aucune notification'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <NotificationItem notification={item} />}
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