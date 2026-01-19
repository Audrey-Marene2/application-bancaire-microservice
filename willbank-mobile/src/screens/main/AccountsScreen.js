// ==========================================
// src/screens/main/AccountsScreen.js
// ==========================================
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { accountsAPI } from '../../api/accounts';
import { AccountList } from '../../components/account/AccountList';
import { CreateAccountModal } from '../../components/account/CreateAccountModal';
import { Loading } from '../../components/common/Loading';
import { COLORS } from '../../constants/colors';

export const AccountsScreen = ({ navigation }) => {
  const { client } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const loadAccounts = async () => {
    try {
      if (!client) return;
      const data = await accountsAPI.getByCustomerId(client.id);
      setAccounts(data);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [client]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAccounts();
  };

  const handleAccountPress = (account) => {
    navigation.navigate('Transactions', { account });
  };

  const handleAccountCreated = () => {
    loadAccounts();
  };

  if (loading) {
    return <Loading message="Chargement des comptes..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Comptes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <AccountList
          accounts={accounts}
          onAccountPress={handleAccountPress}
          emptyMessage="Vous n'avez pas encore de compte. Créez-en un !"
        />
      </ScrollView>

      <CreateAccountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        customerId={client?.id}
        onSuccess={handleAccountCreated}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    padding: 4,
  },
});