// ==========================================
// src/screens/auth/LoginScreen.js - VERSION CORRIGÉE
// ==========================================
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../constants/colors';
import { validateEmail } from '../../utils/validators';

export const LoginScreen = ({ navigation }) => {
  const { login, error } = useAuth();
  
  // ✅ Changé de 'username' à 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Au moins 6 caractères requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    console.log('🔐 Tentative de connexion avec:', { email, password: '***' });

    setLoading(true);
    
    // ✅ Passer l'email au lieu du username
    const result = await login(email, password);
    
    setLoading(false);

    if (!result.success) {
      setErrors({ general: result.error });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>WillBank</Text>
          </View>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Bienvenue ! Connectez-vous à votre compte</Text>
        </View>

        <View style={styles.form}>
          {(error || errors.general) && <ErrorMessage message={error || errors.general} />}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Entrez votre email"
            autoCapitalize="none"
            keyboardType="email-address"
            icon="mail"
            error={errors.email}
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="Entrez votre mot de passe"
            secureTextEntry
            icon="lock-closed"
            error={errors.password}
          />

          <Button
            title="Se connecter"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous n'avez pas de compte ? </Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Register')}
            >
              S'inscrire
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
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  loginButton: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
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