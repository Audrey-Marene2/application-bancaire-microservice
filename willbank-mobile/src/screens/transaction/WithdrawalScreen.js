// ==========================================
// src/screens/transaction/WithdrawalScreen.js
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

export const WithdrawalScreen = ({ navigation, route }) => {
  const { client } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(route.params?.account || null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, [client]);

  const loadAccounts = async () => {
    try {
      if (!client) return;
      const data = await accountsAPI.getByCustomerId(client.id);
      setAccounts(data.filter(acc => acc.status === 'ACTIVE'));
      if (!selectedAccount && data.length > 0) {
        setSelectedAccount(data[0]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les comptes');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!validateAmount(amount)) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    if (!selectedAccount) {
      Alert.alert('Erreur', 'Veuillez sélectionner un compte');
      return;
    }

    const withdrawalAmount = parseFloat(amount);
    const currentBalance = parseFloat(selectedAccount.balance);

    if (withdrawalAmount > currentBalance) {
      Alert.alert('Erreur', 'Solde insuffisant');
      return;
    }

    try {
      setSubmitting(true);

      const transactionData = {
        accountId: selectedAccount.id,
        type: TRANSACTION_TYPES.WITHDRAWAL,
        amount: withdrawalAmount,
      };

      const result = await transactionsAPI.create(transactionData);

      if (result.status === 'SUCCESS') {
        Alert.alert(
          'Succès',
          `Retrait de ${formatCurrency(amount)} effectué avec succès`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Échec', result.failureReason || 'Transaction échouée');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'effectuer le retrait');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Chargement..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.withdrawal + '20' }]}>
            <Ionicons name="arrow-up-circle" size={64} color={COLORS.withdrawal} />
          </View>
          <Text style={styles.title}>Effectuer un retrait</Text>
          <Text style={styles.subtitle}>
            Retirez de l'argent de votre compte
          </Text>
        </View>

        {/* Account Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte source</Text>
          {accounts.map((account) => (
            <Card
              key={account.id}
              style={[
                styles.accountCard,
                selectedAccount?.id === account.id && styles.accountCardSelected,
              ]}
              onPress={() => setSelectedAccount(account)}
            >
              <View style={styles.accountCardContent}>
                <View style={styles.accountInfo}>
                  <Ionicons
                    name={account.type === 'CURRENT' ? 'card' : 'wallet'}
                    size={24}
                    color={
                      selectedAccount?.id === account.id
                        ? COLORS.primary
                        : COLORS.textSecondary
                    }
                  />
                  <View style={styles.accountDetails}>
                    <Text
                      style={[
                        styles.accountType,
                        selectedAccount?.id === account.id && styles.selectedText,
                      ]}
                    >
                      {formatAccountType(account.type)}
                    </Text>
                    <Text style={styles.accountBalance}>
                      {formatCurrency(account.balance)}
                    </Text>
                  </View>
                </View>
                {selectedAccount?.id === account.id && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                )}
              </View>
            </Card>
          ))}
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Input
            label="Montant du retrait"
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="numeric"
            icon="cash"
          />

          {selectedAccount && (
            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="information-circle" size={20} color={COLORS.info} />
                <Text style={styles.infoText}>
                  Solde disponible: {formatCurrency(selectedAccount.balance)}
                </Text>
              </View>
            </Card>
          )}

          {amount && validateAmount(amount) && (
            <Card style={styles.previewCard}>
              <Text style={styles.previewLabel}>Aperçu</Text>
              <View style={styles.previewRow}>
                <Text style={styles.previewText}>Montant à retirer</Text>
                <Text style={[styles.previewAmount, { color: COLORS.withdrawal }]}>
                  -{formatCurrency(amount)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.previewRow}>
                <Text style={styles.previewText}>Nouveau solde</Text>
                <Text style={styles.previewTotal}>
                  {formatCurrency(
                    parseFloat(selectedAccount?.balance || 0) - parseFloat(amount)
                  )}
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Annuler"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Confirmer le retrait"
            onPress={handleWithdrawal}
            loading={submitting}
            disabled={!amount || !validateAmount(amount)}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  accountCard: {
    marginBottom: 12,
  },
  accountCardSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  accountCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountDetails: {
    marginLeft: 12,
  },
  accountType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedText: {
    color: COLORS.primary,
  },
  accountBalance: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoCard: {
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    color: COLORS.textSecondary,
  },
  previewCard: {
    marginTop: 16,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  previewText: {
    color: COLORS.textSecondary,
  },
  previewAmount: {
    fontWeight: '700',
  },
  previewTotal: {
    fontWeight: '700',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
