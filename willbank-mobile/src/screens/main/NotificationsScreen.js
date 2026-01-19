// ==========================================
// src/screens/main/NotificationsScreen.js
// ==========================================
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { notificationsAPI } from '../../api/notifications';
import { NotificationList } from '../../components/notification/NotificationList';
import { Loading } from '../../components/common/Loading';
import { COLORS } from '../../constants/colors';

export const NotificationsScreen = () => {
  const { client } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      if (!client) return;
      const data = await notificationsAPI.getByCustomerId(client.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [client]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  if (loading) {
    return <Loading message="Chargement des notifications..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <NotificationList
          notifications={notifications}
          emptyMessage="Aucune notification"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
