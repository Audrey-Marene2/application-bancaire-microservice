// ==========================================
// src/screens/transaction/PaymentScreen.js
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

export const PaymentScreen = ({ navigation, route }) => {
  const { client } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(
    route.params?.account || null
  );
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, [client]);

  const loadAccounts = async () => {
    try {
      if (!client) return;
      const data = await accountsAPI.getByCustomerId(client.id);
      const activeAccounts = data.filter(
        (acc) => acc.status === 'ACTIVE'
      );
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

  const handlePayment = async () => {
    if (!validateAmount(amount)) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    if (!selectedAccount) {
      Alert.alert('Erreur', 'Veuillez sélectionner un compte');
      return;
    }

    if (!merchant.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le nom du commerçant');
      return;
    }

    const paymentAmount = parseFloat(amount);
    const currentBalance = parseFloat(selectedAccount.balance);

    if (paymentAmount > currentBalance) {
      Alert.alert('Erreur', 'Solde insuffisant');
      return;
    }

    try {
      setSubmitting(true);

      const transactionData = {
        accountId: selectedAccount.id,
        type: TRANSACTION_TYPES.PAYMENT,
        amount: paymentAmount,
      };

      console.log('Données envoyées:', JSON.stringify(transactionData, null, 2));

      const result = await transactionsAPI.create(transactionData);

      if (result && result.status === 'SUCCESS') {
        Alert.alert(
          'Succès',
          `Paiement de ${formatCurrency(paymentAmount)} effectué avec succès chez ${merchant}`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Échec', result.failureReason || 'Paiement échoué');
      }
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Impossible d\'effectuer le paiement');
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
        <Text style={styles.sectionTitle}>Compte débité</Text>

        {accounts.map((account) => (
          <TouchableOpacity
            key={account.id}
            onPress={() => setSelectedAccount(account)}
          >
            <Card
              style={[
                styles.accountCard,
                selectedAccount?.id === account.id &&
                  styles.accountCardSelected,
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

        <Text style={styles.sectionTitle}>Détails du paiement</Text>

        <Input
          label="Montant"
          placeholder="Ex: 5000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Input
          label="Commerçant"
          placeholder="Nom du commerçant"
          value={merchant}
          onChangeText={setMerchant}
        />

        <Input
          label="Référence (optionnel)"
          placeholder="Ex: Facture, Achat, etc."
          value={reference}
          onChangeText={setReference}
        />

        <Button
          title="Effectuer le paiement"
          onPress={handlePayment}
          loading={submitting}
          disabled={submitting}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.text,
  },
  accountCard: {
    marginBottom: 12,
  },
  accountCardSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountType: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  accountRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});