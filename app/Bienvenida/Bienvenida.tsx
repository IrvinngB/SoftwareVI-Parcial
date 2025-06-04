import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  // Place all hooks at the top level
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  // Add state for the nombre input
  const [nombre, setNombre] = useState('');

  // Función para guardar el nombre usando AsyncStorage
  const GuardarNombre = async () => {
    try {
      if (nombre.trim() === '') {
        alert('Por favor ingrese un nombre');
        return;
      }
      
      await AsyncStorage.setItem('nombre_corredor', nombre);
      alert('Nombre guardado correctamente');
      // Aquí puedes agregar navegación a otra pantalla si lo necesitas
    } catch (error) {
      console.error('Error al guardar el nombre:', error);
      alert('Error al guardar el nombre');
    }
  };
  
  // Determinar colores para elementos de la interfaz basados en el tema
  const inputBgColor = colorScheme === 'dark' ? Colors.palette.navy : '#fff';
  const inputBorderColor = colorScheme === 'dark' ? Colors.palette.slateBlue : Colors.palette.lightSlate;
  const placeholderColor = colorScheme === 'dark' ? Colors.palette.lightSlate : Colors.palette.slateBlue;
  const credentialsBgColor = colorScheme === 'dark' ? Colors.palette.darkNavy : Colors.palette.lightGray;
  const credentialsTitleColor = colorScheme === 'dark' ? Colors.palette.lightSlate : Colors.palette.slateBlue;
  
  
  

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      {/* Contenedor de bienvenida */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bienvenido a Pace & Progress </ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Contenedor de instrucciones */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Porfavor ingrese el nombre del corredor</ThemedText>
        <TextInput
          style={[styles.input, { 
            backgroundColor: inputBgColor, 
            borderColor: inputBorderColor,
            color: textColor 
          }]}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ingrese su nombre"
          placeholderTextColor={placeholderColor}
          keyboardType="default"
          autoCapitalize="none"
        />
      </ThemedView>

      
      {/* Botón para guardar nombre */}
      <TouchableOpacity 
                style={[styles.loginButton, { backgroundColor: tintColor }]} 
                onPress={GuardarNombre}
              >
                <ThemedText style={styles.loginButtonText}>
                  Guardar Nombre
                </ThemedText>
        </TouchableOpacity>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});