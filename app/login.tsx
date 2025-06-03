import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

// Datos quemados para el login
const CREDENTIALS = {
  email: 'admin@ejemplo.com',
  password: '123456'
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Determinar colores para elementos de la interfaz basados en el tema
  const inputBgColor = colorScheme === 'dark' ? Colors.palette.navy : '#fff';
  const inputBorderColor = colorScheme === 'dark' ? Colors.palette.slateBlue : Colors.palette.lightSlate;
  const placeholderColor = colorScheme === 'dark' ? Colors.palette.lightSlate : Colors.palette.slateBlue;
  const credentialsBgColor = colorScheme === 'dark' ? Colors.palette.darkNavy : Colors.palette.lightGray;
  const credentialsTitleColor = colorScheme === 'dark' ? Colors.palette.lightSlate : Colors.palette.slateBlue;

  const handleLogin = () => {
    if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
      Alert.alert(
        'Login Exitoso',
        '¡Bienvenido!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } else {
      Alert.alert(
        'Error de Login',
        'Email o contraseña incorrectos\n\nCredenciales de prueba:\nEmail: admin@ejemplo.com\nContraseña: 123456'
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.loginContainer, { backgroundColor }]}>
        <ThemedText type="title" style={styles.title}>
          Iniciar Sesión
        </ThemedText>
        
        <ThemedView style={styles.inputContainer}>
          <ThemedText type="defaultSemiBold">Email:</ThemedText>
          <TextInput
            style={[styles.input, { 
              backgroundColor: inputBgColor, 
              borderColor: inputBorderColor,
              color: textColor 
            }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Ingresa tu email"
            placeholderTextColor={placeholderColor}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedText type="defaultSemiBold">Contraseña:</ThemedText>
          <TextInput
            style={[styles.input, { 
              backgroundColor: inputBgColor, 
              borderColor: inputBorderColor,
              color: textColor 
            }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor={placeholderColor}
            secureTextEntry
          />
        </ThemedView>

        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: tintColor }]} 
          onPress={handleLogin}
        >
          <ThemedText style={styles.loginButtonText}>
            Iniciar Sesión
          </ThemedText>
        </TouchableOpacity>

        <ThemedView style={[styles.credentialsInfo, { backgroundColor: credentialsBgColor }]}>
          <ThemedText type="subtitle" style={[styles.credentialsTitle, { color: credentialsTitleColor }]}>
            Credenciales de Prueba:
          </ThemedText>
          <ThemedText>Email: admin@ejemplo.com</ThemedText>
          <ThemedText>Contraseña: 123456</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
  },
  loginButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  credentialsInfo: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
  },
  credentialsTitle: {
    marginBottom: 10,
    fontWeight: '600',
  },
});