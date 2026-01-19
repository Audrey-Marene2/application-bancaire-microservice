// ==========================================
// src/components/transaction/TransactionModal.js
// ==========================================
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { COLORS } from '../../constants/colors';
import { TRANSACTION_TYPES } from '../../constants/types';
import { transactionsAPI } from '../../api/transactions';
import { validateAmount } from '../../utils/validators';

export const TransactionModal = ({ visible, onClose, account, type, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const getTitle = () => {
    switch (type) {
      case TRANSACTION_TYPES.DEPOSIT:
        return 'Effectuer un dépôt';
      case TRANSACTION_TYPES.WITHDRAWAL:
        return 'Effectuer un retrait';
      case TRANSACTION_TYPES.TRANSFER:
        return 'Effectuer un virement';
      case TRANSACTION_TYPES.PAYMENT:
        return 'Effectuer un paiement';
      default:
        return 'Nouvelle transaction';
    }
  };

  const getIcon = () => {
    switch (type) {
      case TRANSACTION_TYPES.DEPOSIT:
        return 'arrow-down-circle';
      case TRANSACTION_TYPES.WITHDRAWAL:
        return 'arrow-up-circle';
      case TRANSACTION_TYPES.TRANSFER:
        return 'swap-horizontal';
      case TRANSACTION_TYPES.PAYMENT:
        return 'card';
      default:
        return 'cash';
    }
  };

  const handleTransaction = async () => {
    if (!validateAmount(amount)) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    try {
      setLoading(true);
      const transactionData = {
        accountId: account.id,
        type,
        amount: parseFloat(amount),
      };

      const result = await transactionsAPI.create(transactionData);
      
      if (result.status === 'SUCCESS') {
        Alert.alert('Succès', 'Transaction effectuée avec succès');
        onSuccess();
        onClose();
      } else {
        Alert.alert('Échec', result.failureReason || 'Transaction échouée');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'effectuer la transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <View style={styles.header}>
              <Text style={styles.title}>{getTitle()}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name={getIcon()} size={48} color={COLORS.primary} />
              </View>
            </View>

            {account && (
              <View style={styles.accountInfo}>
                <Text style={styles.accountLabel}>Compte sélectionné</Text>
                <Text style={styles.accountType}>
                  {account.type === 'CURRENT' ? 'Compte Courant' : 'Compte Épargne'}
                </Text>
                <Text style={styles.accountBalance}>
                  Solde: {account.balance} FCFA
                </Text>
              </View>
            )}

            <Input
              label="Montant"
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              keyboardType="numeric"
              icon="cash"
            />

            <View style={styles.actions}>
              <Button
                title="Annuler"
                onPress={onClose}
                variant="outline"
                style={styles.button}
              />
              <Button
                title="Confirmer"
                onPress={handleTransaction}
                loading={loading}
                style={styles.button}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 450,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfo: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  accountLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  accountType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  accountBalance: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
});