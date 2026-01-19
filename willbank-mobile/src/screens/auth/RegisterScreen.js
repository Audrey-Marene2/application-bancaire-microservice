// ==========================================
// src/screens/auth/RegisterScreen.js - VERSION CORRIGÉE
// ==========================================
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../api/auth';
import { clientsAPI } from '../../api/clients';
import { COLORS } from '../../constants/colors';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
} from '../../utils/validators';

export const RegisterScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Au moins 3 caractères alphanumériques';
    }

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Au moins 6 caractères requis';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.phone) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      console.log('📝 Étape 1: Création du compte utilisateur (Auth)');
      
      // 1️⃣ Créer le compte utilisateur dans Auth Service
      const authResponse = await authAPI.register(
        formData.username,
        formData.email,
        formData.password
      );

      console.log('✅ Compte utilisateur créé:', authResponse);

      console.log('📝 Étape 2: Création du profil client');

      // 2️⃣ Créer le profil client dans Client Service
      const clientData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || 'N/A',
      };

      const clientResponse = await clientsAPI.create(clientData);

      console.log('✅ Profil client créé:', clientResponse);

      Alert.alert(
        'Succès',
        'Votre compte a été créé avec succès !',
        [
          {
            text: 'OK',
            onPress: async () => {
              // 3️⃣ Connexion automatique avec l'EMAIL
              console.log('📝 Étape 3: Connexion automatique');
              await login(formData.email, formData.password);
            }
          }
        ]
      );

    } catch (err) {
      console.error('❌ Erreur lors de l\'inscription:', err);

      let errorMessage = 'Impossible de créer le compte';

      if (err.response) {
        if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 400) {
          errorMessage = 'Données invalides. Vérifiez vos informations.';
        } else if (err.response.status === 409) {
          errorMessage = 'Un compte avec cet email existe déjà.';
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert('Erreur', errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>Créez votre compte WillBank</Text>
        </View>

        <View style={styles.form}>
          {errors.general && <ErrorMessage message={errors.general} />}

          <Text style={styles.sectionTitle}>Informations de connexion</Text>

          <Input
            label="Nom d'utilisateur"
            value={formData.username}
            onChangeText={(value) => updateField('username', value)}
            placeholder="Choisissez un nom d'utilisateur"
            autoCapitalize="none"
            icon="person"
            error={errors.username}
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
            error={errors.email}
          />

          <Input
            label="Mot de passe"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            placeholder="Minimum 6 caractères"
            secureTextEntry
            icon="lock-closed"
            error={errors.password}
          />

          <Input
            label="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            placeholder="Répétez le mot de passe"
            secureTextEntry
            icon="lock-closed"
            error={errors.confirmPassword}
          />

          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <Input
            label="Prénom"
            value={formData.firstName}
            onChangeText={(value) => updateField('firstName', value)}
            placeholder="Votre prénom"
            icon="person"
            error={errors.firstName}
          />

          <Input
            label="Nom"
            value={formData.lastName}
            onChangeText={(value) => updateField('lastName', value)}
            placeholder="Votre nom"
            icon="person"
            error={errors.lastName}
          />

          <Input
            label="Téléphone"
            value={formData.phone}
            onChangeText={(value) => updateField('phone', value)}
            placeholder="+237 6XX XXX XXX"
            keyboardType="phone-pad"
            icon="call"
            error={errors.phone}
          />

          <Input
            label="Adresse (optionnel)"
            value={formData.address}
            onChangeText={(value) => updateField('address', value)}
            placeholder="Votre adresse"
            icon="location"
          />

          <Button
            title="S'inscrire"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous avez déjà un compte ? </Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Login')}
            >
              Se connecter
            </Text>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  form: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  link: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});