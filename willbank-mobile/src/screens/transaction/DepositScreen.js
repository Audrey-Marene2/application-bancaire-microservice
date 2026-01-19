// ==========================================
// src/screens/transaction/DepositScreen.js
// ==========================================
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../hooks/useAuth';
import { accountsAPI } from '../../api/accounts';
import { transactionsAPI } from '../../api/transactions';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Loading } from '../../components/common/Loading';

import { COLORS } from '../../constants/colors';
import { TRANSACTION_TYPES } from '../../constants/types';
import { formatCurrency, formatAccountType } from '../../utils/formatters';
import { validateAmount } from '../../utils/validators';

export const DepositScreen = ({ navigation, route }) => {
  const { client } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(
    route.params?.account || null
  );
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, [client]);

  const loadAccounts = async () => {
    try {
      if (!client) return;
      const data = await accountsAPI.getByCustomerId(client.id);
      const activeAccounts = data.filter(acc => acc.status === 'ACTIVE');
      setAccounts(activeAccounts);

      if (!selectedAccount && activeAccounts.length > 0) {
        setSelectedAccount(activeAccounts[0]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les comptes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!validateAmount(amount)) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    if (!selectedAccount) {
      Alert.alert('Erreur', 'Veuillez sélectionner un compte');
      return;
    }

    try {
      setSubmitting(true);

      const transactionData = {
        accountId: selectedAccount.id,
        type: TRANSACTION_TYPES.DEPOSIT,
        amount: parseFloat(amount),
      };

      const result = await transactionsAPI.create(transactionData);

      if (result.status === 'SUCCESS') {
        Alert.alert(
          'Succès',
          `Dépôt de ${formatCurrency(amount)} effectué avec succès`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Échec', result.failureReason || 'Transaction échouée');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d’effectuer le dépôt');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Chargement des comptes..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="arrow-down-circle" size={64} color={COLORS.deposit} />
          </View>
          <Text style={styles.title}>Effectuer un dépôt</Text>
          <Text style={styles.subtitle}>
            Déposez de l'argent sur votre compte
          </Text>
        </View>

        {/* Accounts */}
        <Text style={styles.sectionTitle}>Compte de destination</Text>

        {accounts.map(account => (
          <TouchableOpacity
            key={account.id}
            onPress={() => setSelectedAccount(account)}
          >
            <Card
              style={[
                styles.accountCard,
                selectedAccount?.id === account.id && styles.accountSelected,
              ]}
            >
              <View style={styles.accountRow}>
                <View>
                  <Text style={styles.accountType}>
                    {formatAccountType(account.type)}
                  </Text>
                  <Text style={styles.accountNumber}>
                    {account.accountNumber}
                  </Text>
                </View>

                <View style={styles.accountRight}>
                  <Text style={styles.accountBalance}>
                    {formatCurrency(account.balance)}
                  </Text>
                  {selectedAccount?.id === account.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={COLORS.primary}
                    />
                  )}
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Amount */}
        <Text style={styles.sectionTitle}>Montant du dépôt</Text>

        <Input
          placeholder="0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {amount && validateAmount(amount) && selectedAccount && (
          <Card style={styles.previewCard}>
            <Text style={styles.previewText}>Nouveau solde</Text>
            <Text style={styles.previewAmount}>
              {formatCurrency(
                parseFloat(selectedAccount.balance) + parseFloat(amount)
              )}
            </Text>
          </Card>
        )}

        {/* Actions */}
        <Button
          title="Confirmer le dépôt"
          onPress={handleDeposit}
          loading={submitting}
          disabled={!amount || !validateAmount(amount)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },

  header: { alignItems: 'center', marginBottom: 24 },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.deposit + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textSecondary },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
  },

  accountCard: { marginBottom: 10 },
  accountSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  accountType: { fontSize: 14, color: COLORS.textSecondary },
  accountNumber: { fontSize: 16, fontWeight: '600' },
  accountBalance: { fontSize: 16, fontWeight: 'bold' },

  accountRight: { alignItems: 'flex-end' },

  previewCard: { marginVertical: 16, alignItems: 'center' },
  previewText: { fontSize: 14, color: COLORS.textSecondary },
  previewAmount: { fontSize: 20, fontWeight: 'bold', color: COLORS.deposit },
});
