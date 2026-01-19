// ==========================================
// src/screens/main/DashboardScreen.js
// ==========================================
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../hooks/useAuth';
import { compositeAPI } from '../../api/composite';

import { Card } from '../../components/common/Card';
import { AccountCard } from '../../components/account/AccountCard';
import { TransactionItem } from '../../components/transaction/TransactionItem';
import { Loading } from '../../components/common/Loading';

import { COLORS } from '../../constants/colors';
import { formatCurrency, getInitials } from '../../utils/formatters';

export const DashboardScreen = ({ navigation }) => {
  const { client, logout } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      if (!client) return;
      const data = await compositeAPI.getDashboard(client.id);
      setDashboard(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [client]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboard();
  }, [client]);

  if (loading) {
    return <Loading message="Chargement du tableau de bord..." />;
  }

  if (!dashboard) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Impossible de charger les données</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(
                dashboard.client?.firstName,
                dashboard.client?.lastName
              )}
            </Text>
          </View>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>
              {dashboard.client?.firstName} {dashboard.client?.lastName}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* ================= SOLDE TOTAL ================= */}
      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Solde total</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(dashboard.totalBalance)}
        </Text>

        <View style={styles.balanceInfo}>
          <Ionicons name="wallet" size={16} color="#fff" />
          <Text style={styles.balanceInfoText}>
            {dashboard.accounts?.length || 0} compte(s)
          </Text>
        </View>
      </Card>

      {/* ================= ACTIONS RAPIDES ================= */}

      {/* ================= MES COMPTES ================= */}
      {dashboard.accounts?.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes comptes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {dashboard.accounts.slice(0, 2).map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onPress={() =>
                navigation.navigate('Transactions', { account })
              }
            />
          ))}
        </View>
      )}

      {/* ================= TRANSACTIONS RÉCENTES ================= */}
      {dashboard.recentTransactions?.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {dashboard.recentTransactions.slice(0, 5).map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

/* ================= COMPOSANTS INTERNES ================= */

const ActionButton = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const TransactionButton = ({ icon, label, color, onPress }) => (
  <TouchableOpacity
    style={[styles.transactionButton, { backgroundColor: color + '20' }]}
    onPress={onPress}
  >
    <Ionicons name={icon} size={32} color={color} />
    <Text style={[styles.transactionButtonText, { color }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  balanceCard: {
    margin: 16,
    backgroundColor: COLORS.primary,
    padding: 24,
  },

  balanceLabel: {
    color: '#fff',
    opacity: 0.8,
  },

  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },

  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  balanceInfoText: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 12,
  },

  section: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 12,
    color: COLORS.text,
  },

  seeAll: {
    color: COLORS.primary,
    fontWeight: '500',
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },

  actionButton: {
    alignItems: 'center',
    width: '22%',
  },

  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  actionText: {
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.text,
  },

  transactionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },

  transactionButton: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  transactionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});
