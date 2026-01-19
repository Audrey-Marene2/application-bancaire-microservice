// ==========================================
// src/components/notification/NotificationItem.js
// ==========================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { COLORS } from '../../constants/colors';
import { formatDateTime } from '../../utils/formatters';

export const NotificationItem = ({ notification }) => {
  const getNotificationIcon = (channel) => {
    switch (channel) {
      case 'EMAIL':
        return 'mail';
      case 'PUSH':
        return 'notifications';
      case 'SMS':
        return 'chatbubble';
      default:
        return 'information-circle';
    }
  };

  const getNotificationColor = (status) => {
    return status === 'SENT' ? COLORS.success : COLORS.error;
  };

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getNotificationColor(notification.status) + '20' },
          ]}
        >
          <Ionicons
            name={getNotificationIcon(notification.channel)}
            size={24}
            color={getNotificationColor(notification.status)}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={styles.date}>{formatDateTime(notification.createdAt)}</Text>
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
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});
