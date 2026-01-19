// ==========================================
// src/screens/main/ProfileScreen.js
// ==========================================
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { COLORS } from '../../constants/colors';
import { getInitials, formatDate } from '../../utils/formatters';

export const ProfileScreen = () => {
  const { user, client, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(client?.firstName, client?.lastName)}
          </Text>
        </View>
        <Text style={styles.name}>
          {client?.firstName} {client?.lastName}
        </Text>
        <Text style={styles.email}>{client?.email}</Text>
      </View>

      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>

        <View style={styles.infoRow}>
          <Ionicons name="person" size={20} color={COLORS.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Nom complet</Text>
            <Text style={styles.infoValue}>
              {client?.firstName} {client?.lastName}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color={COLORS.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{client?.email}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color={COLORS.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>{client?.phone}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color={COLORS.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Adresse</Text>
            <Text style={styles.infoValue}>{client?.address || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color={COLORS.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Membre depuis</Text>
            <Text style={styles.infoValue}>
              {formatDate(client?.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Statut</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    client?.status === 'ACTIVE' ? COLORS.success + '20' : COLORS.error + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: client?.status === 'ACTIVE' ? COLORS.success : COLORS.error,
                  },
                ]}
              >
                {client?.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingTop: 60,
    backgroundColor: COLORS.surface,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoCard: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error + '40',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 8,
  },
});