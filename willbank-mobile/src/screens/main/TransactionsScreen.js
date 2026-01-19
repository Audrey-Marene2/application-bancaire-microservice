// ==========================================
// src/screens/main/TransactionsScreen.js
// ==========================================
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { accountsAPI } from '../../api/accounts';
import { transactionsAPI } from '../../api/transactions';
import { TransactionList } from '../../components/transaction/TransactionList';
import { TransactionModal } from '../../components/transaction/TransactionModal';
import { Loading } from '../../components/common/Loading';
import { COLORS } from '../../constants/colors';
import { TRANSACTION_TYPES } from '../../constants/types';
import { formatCurrency, formatAccountType } from '../../utils/formatters';

export const TransactionsScreen = ({ navigation, route }) => {
  const { client } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(route.params?.account || null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState(null);

  const loadAccounts = async () => {
    try {
      if (!client) return;
      const data = await accountsAPI.getByCustomerId(client.id);
      setAccounts(data);
      if (!selectedAccount && data.length > 0) {
        setSelectedAccount(data[0]);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      if (!selectedAccount) return;
      const data = await transactionsAPI.getByAccountId(selectedAccount.id);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [client]);

  useEffect(() => {
    if (selectedAccount) {
      setLoading(true);
      loadTransactions();
    }
  }, [selectedAccount]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAccounts();
    loadTransactions();
  };

  const handleTransactionCreated = () => {
    loadAccounts();
    loadTransactions();
  };

  const openTransactionModal = (type) => {
  if (!selectedAccount) {
    Alert.alert('Erreur', 'Veuillez sélectionner un compte');
    return;
  }

  // Navigation vers les écrans dédiés
  switch (type) {
    case TRANSACTION_TYPES.DEPOSIT:
      navigation.navigate('Deposit', { account: selectedAccount });
      break;
    case TRANSACTION_TYPES.WITHDRAWAL:
      navigation.navigate('Withdrawal', { account: selectedAccount });
      break;
    case TRANSACTION_TYPES.TRANSFER:
      navigation.navigate('Transfer', { account: selectedAccount });
      break;
    case TRANSACTION_TYPES.PAYMENT:
      navigation.navigate('Payment', { account: selectedAccount });
      break;
  }
};
  if (loading) {
    return <Loading message="Chargement des transactions..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      {/* Account Selector */}
      {accounts.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.accountSelector}
          contentContainerStyle={styles.accountSelectorContent}
        >
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[
                styles.accountChip,
                selectedAccount?.id === account.id && styles.accountChipActive,
              ]}
              onPress={() => setSelectedAccount(account)}
            >
              <Text
                style={[
                  styles.accountChipText,
                  selectedAccount?.id === account.id && styles.accountChipTextActive,
                ]}
              >
                {formatAccountType(account.type)}
              </Text>
              <Text
                style={[
                  styles.accountChipBalance,
                  selectedAccount?.id === account.id && styles.accountChipTextActive,
                ]}
              >
                {formatCurrency(account.balance)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Transaction Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.deposit + '20' }]}
          onPress={() => openTransactionModal(TRANSACTION_TYPES.DEPOSIT)}
        >
          <Ionicons name="arrow-down-circle" size={24} color={COLORS.deposit} />
          <Text style={[styles.actionButtonText, { color: COLORS.deposit }]}>Dépôt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.withdrawal + '20' }]}
          onPress={() => openTransactionModal(TRANSACTION_TYPES.WITHDRAWAL)}
        >
          <Ionicons name="arrow-up-circle" size={24} color={COLORS.withdrawal} />
          <Text style={[styles.actionButtonText, { color: COLORS.withdrawal }]}>
            Retrait
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.transfer + '20' }]}
          onPress={() => openTransactionModal(TRANSACTION_TYPES.TRANSFER)}
        >
          <Ionicons name="swap-horizontal" size={24} color={COLORS.transfer} />
          <Text style={[styles.actionButtonText, { color: COLORS.transfer }]}>
            Virement
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.payment + '20' }]}
          onPress={() => openTransactionModal(TRANSACTION_TYPES.PAYMENT)}
        >
          <Ionicons name="card" size={24} color={COLORS.payment} />
          <Text style={[styles.actionButtonText, { color: COLORS.payment }]}>
            Paiement
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <ScrollView
        style={styles.transactionsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <TransactionList
          transactions={transactions}
          emptyMessage="Aucune transaction pour ce compte"
        />
      </ScrollView>

      {/* Transaction Modal */}
      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        account={selectedAccount}
        type={transactionType}
        onSuccess={handleTransactionCreated}
      />
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
  accountSelector: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
  },
  accountSelectorContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  accountChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  accountChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  accountChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
  },
  accountChipTextActive: {
    color: '#fff',
  },
  accountChipBalance: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: '600',
  },
  transactionsList: {
    flex: 1,
  },
});