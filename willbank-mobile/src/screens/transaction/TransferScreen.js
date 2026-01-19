// ==========================================
// src/screens/transaction/TransferScreen.js
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

export const TransferScreen = ({ navigation, route }) => {
  const { client } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [sourceAccount, setSourceAccount] = useState(route.params?.account || null);
  const [destinationAccount, setDestinationAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, [client]);

  const loadAccounts = async () => {
    try {
      if (!client) return;
      const data = await accountsAPI.getByCustomerId(client.id);
      const activeAccounts = data.filter(acc => acc.status === 'ACTIVE');
      setAccounts(activeAccounts);
      if (!sourceAccount && activeAccounts.length > 0) {
        setSourceAccount(activeAccounts[0]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les comptes');
    } finally {
      setLoading(false);
    }
  };

  const availableDestinations = accounts.filter(
    (acc) => acc.id !== sourceAccount?.id
  );

  const handleTransfer = async () => {
    // ========== VALIDATION ==========
    if (!validateAmount(amount)) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    if (!sourceAccount) {
      Alert.alert('Erreur', 'Veuillez sélectionner un compte source');
      return;
    }

    if (!destinationAccount) {
      Alert.alert('Erreur', 'Veuillez sélectionner un compte destination');
      return;
    }

    if (sourceAccount.id === destinationAccount.id) {
      Alert.alert('Erreur', 'Les comptes source et destination doivent être différents');
      return;
    }

    const transferAmount = parseFloat(amount);
    const currentBalance = parseFloat(sourceAccount.balance);

    if (transferAmount > currentBalance) {
      Alert.alert('Erreur', 'Solde insuffisant');
      return;
    }

    try {
      setSubmitting(true);

      console.log('💸 Virement en cours:', {
        sourceAccountId: sourceAccount.id,
        targetAccountId: destinationAccount.id,  // ✅ CORRECTION ICI
        amount: transferAmount,
      });

      // ✅ APPEL API CORRIGÉ
      const transactionData = {
        sourceAccountId: sourceAccount.id,
        targetAccountId: destinationAccount.id,  // ✅ Le backend attend "targetAccountId"
        amount: transferAmount,
      };

      console.log('📤 Envoi virement:', transactionData);

      const result = await transactionsAPI.transfer(transactionData);

      console.log('📥 Résultat virement:', result);

      if (result.status === 'SUCCESS') {
        Alert.alert(
          'Succès',
          `Virement de ${formatCurrency(amount)} effectué avec succès`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Échec', result.failureReason || 'Virement échoué');
      }
    } catch (error) {
      console.error('❌ Erreur virement:', error);
      Alert.alert('Erreur', 'Impossible d\'effectuer le virement');
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
          <View style={[styles.iconContainer, { backgroundColor: COLORS.transfer + '20' }]}>
            <Ionicons name="swap-horizontal" size={64} color={COLORS.transfer} />
          </View>
          <Text style={styles.title}>Effectuer un virement</Text>
          <Text style={styles.subtitle}>
            Transférez de l'argent entre vos comptes
          </Text>
        </View>

        {/* Source Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte source</Text>
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              onPress={() => {
                setSourceAccount(account);
                if (destinationAccount?.id === account.id) {
                  setDestinationAccount(null);
                }
              }}
            >
              <Card
                style={[
                  styles.accountCard,
                  sourceAccount?.id === account.id && styles.accountCardSelected,
                ]}
              >
                <View style={styles.accountCardContent}>
                  <View style={styles.accountInfo}>
                    <Ionicons
                      name={account.type === 'CURRENT' ? 'card' : 'wallet'}
                      size={24}
                      color={
                        sourceAccount?.id === account.id
                          ? COLORS.primary
                          : COLORS.textSecondary
                      }
                    />
                    <View style={styles.accountDetails}>
                      <Text
                        style={[
                          styles.accountType,
                          sourceAccount?.id === account.id && styles.selectedText,
                        ]}
                      >
                        {formatAccountType(account.type)}
                      </Text>
                      <Text style={styles.accountBalance}>
                        {formatCurrency(account.balance)}
                      </Text>
                    </View>
                  </View>
                  {sourceAccount?.id === account.id && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transfer Icon */}
        <View style={styles.transferIcon}>
          <Ionicons name="arrow-down" size={32} color={COLORS.textSecondary} />
        </View>

        {/* Destination Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte destination</Text>
          {availableDestinations.length > 0 ? (
            availableDestinations.map((account) => (
              <TouchableOpacity
                key={account.id}
                onPress={() => setDestinationAccount(account)}
              >
                <Card
                  style={[
                    styles.accountCard,
                    destinationAccount?.id === account.id && styles.accountCardSelected,
                  ]}
                >
                  <View style={styles.accountCardContent}>
                    <View style={styles.accountInfo}>
                      <Ionicons
                        name={account.type === 'CURRENT' ? 'card' : 'wallet'}
                        size={24}
                        color={
                          destinationAccount?.id === account.id
                            ? COLORS.primary
                            : COLORS.textSecondary
                        }
                      />
                      <View style={styles.accountDetails}>
                        <Text
                          style={[
                            styles.accountType,
                            destinationAccount?.id === account.id && styles.selectedText,
                          ]}
                        >
                          {formatAccountType(account.type)}
                        </Text>
                        <Text style={styles.accountBalance}>
                          {formatCurrency(account.balance)}
                        </Text>
                      </View>
                    </View>
                    {destinationAccount?.id === account.id && (
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Vous devez avoir au moins 2 comptes pour effectuer un virement
              </Text>
            </Card>
          )}
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Input
            label="Montant du virement"
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="numeric"
            icon="cash"
          />

          <Input
            label="Description (optionnel)"
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Économies mensuelles"
            icon="document-text"
          />

          {amount && validateAmount(amount) && sourceAccount && destinationAccount && (
            <Card style={styles.previewCard}>
              <Text style={styles.previewLabel}>Aperçu du virement</Text>

              <View style={styles.previewSection}>
                <Text style={styles.previewSubtitle}>Compte source</Text>
                <View style={styles.previewRow}>
                  <Text style={styles.previewText}>
                    {formatAccountType(sourceAccount.type)}
                  </Text>
                  <Text style={[styles.previewAmount, { color: COLORS.withdrawal }]}>
                    -{formatCurrency(amount)}
                  </Text>
                </View>
                <Text style={styles.previewDetail}>
                  Nouveau solde: {formatCurrency(
                    parseFloat(sourceAccount.balance) - parseFloat(amount)
                  )}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.previewSection}>
                <Text style={styles.previewSubtitle}>Compte destination</Text>
                <View style={styles.previewRow}>
                  <Text style={styles.previewText}>
                    {formatAccountType(destinationAccount.type)}
                  </Text>
                  <Text style={[styles.previewAmount, { color: COLORS.deposit }]}>
                    +{formatCurrency(amount)}
                  </Text>
                </View>
                <Text style={styles.previewDetail}>
                  Nouveau solde: {formatCurrency(
                    parseFloat(destinationAccount.balance) + parseFloat(amount)
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
            title="Confirmer le virement"
            onPress={handleTransfer}
            loading={submitting}
            disabled={
              !amount ||
              !validateAmount(amount) ||
              !sourceAccount ||
              !destinationAccount
            }
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
    paddingTop: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 16,
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
    flex: 1,
  },
  accountDetails: {
    marginLeft: 12,
    flex: 1,
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
    marginTop: 2,
  },
  transferIcon: {
    alignItems: 'center',
    marginVertical: 16,
  },
  emptyCard: {
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  previewCard: {
    marginTop: 16,
    backgroundColor: COLORS.surface,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  previewSection: {
    marginBottom: 12,
  },
  previewSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 14,
    color: COLORS.text,
  },
  previewAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
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