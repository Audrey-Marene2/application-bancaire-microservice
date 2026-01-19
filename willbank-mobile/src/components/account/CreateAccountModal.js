// ==========================================
// src/components/account/CreateAccountModal.js
// ==========================================
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { COLORS } from '../../constants/colors';
import { ACCOUNT_TYPES } from '../../constants/types';
import { accountsAPI } from '../../api/accounts';
import { validateAmount } from '../../utils/validators';

export const CreateAccountModal = ({ visible, onClose, customerId, onSuccess }) => {
  const [selectedType, setSelectedType] = useState(ACCOUNT_TYPES.CURRENT);
  const [initialBalance, setInitialBalance] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!validateAmount(initialBalance)) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    try {
      setLoading(true);
      const accountData = {
        customerId,
        type: selectedType,
        balance: parseFloat(initialBalance),
        status: 'ACTIVE',
      };

      await accountsAPI.create(accountData);
      Alert.alert('Succès', 'Compte créé avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le compte');
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
          <View style={styles.header}>
            <Text style={styles.title}>Créer un compte</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Type de compte</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === ACCOUNT_TYPES.CURRENT && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType(ACCOUNT_TYPES.CURRENT)}
            >
              <Ionicons
                name="card"
                size={24}
                color={selectedType === ACCOUNT_TYPES.CURRENT ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.typeText,
                  selectedType === ACCOUNT_TYPES.CURRENT && styles.typeTextActive,
                ]}
              >
                Compte Courant
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === ACCOUNT_TYPES.SAVINGS && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType(ACCOUNT_TYPES.SAVINGS)}
            >
              <Ionicons
                name="wallet"
                size={24}
                color={selectedType === ACCOUNT_TYPES.SAVINGS ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.typeText,
                  selectedType === ACCOUNT_TYPES.SAVINGS && styles.typeTextActive,
                ]}
              >
                Compte Épargne
              </Text>
            </TouchableOpacity>
          </View>

          <Input
            label="Montant initial"
            value={initialBalance}
            onChangeText={setInitialBalance}
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
              title="Créer"
              onPress={handleCreate}
              loading={loading}
              style={styles.button}
            />
          </View>
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
    minHeight: 400,
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    gap: 8,
  },
  typeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  typeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  typeTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
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