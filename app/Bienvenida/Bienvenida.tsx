import Nav from '@/components/Nav';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  // Place all hooks at the top level
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  
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
  const buttonColor = colorScheme === 'dark' ? Colors.palette.slateBlue : Colors.palette.slateBlue;
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ 
        light: Colors.palette.lightSlate, 
        dark: Colors.palette.darkNavy 
      }}
      headerImage={
        <Image
          source={require('@/assets/images/fondo.jpg')}
          style={styles.headerImage}
        />
      }>

      {/* Contenedor de bienvenida */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ lineHeight: 40 }}>Bienvenido a Pace & Progress</ThemedText>
      </ThemedView>

      {/* Tarjeta informativa sencilla */}
      <ThemedView style={[styles.card, { 
        backgroundColor: colorScheme === 'dark' ? Colors.palette.navy : Colors.palette.lightGray 
      }]}>
        <ThemedText style={styles.cardText}>
          Registra tu nombre para comenzar a monitorear tu progreso
        </ThemedText>
      </ThemedView>

      {/* Contenedor de instrucciones */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Ingresa el nombre del corredor</ThemedText>
        
        <TextInput
          style={[styles.input, { 
            backgroundColor: inputBgColor, 
            borderColor: inputBorderColor,
            color: textColor 
          }]}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre del corredor"
          placeholderTextColor={placeholderColor}
          keyboardType="default"
          autoCapitalize="words"
        />
      </ThemedView>
      
      {/* Botón para guardar nombre */}
      <TouchableOpacity 
        style={[styles.loginButton, { backgroundColor: buttonColor }]} 
        onPress={GuardarNombre}
      >
        <AntDesign name="save" size={16} color="#fff" style={styles.buttonIcon} />
        <ThemedText style={styles.loginButtonText}>
          Guardar Nombre
        </ThemedText>
      </TouchableOpacity>

       <Nav />

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
    minHeight: 80
  
  },
  stepContainer: {
    gap: 8,
    marginBottom: 20,
  },
  headerImage: {
    height: 200,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    marginVertical: 10,
  },
  loginButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  cardText: {
    lineHeight: 20,
  }
});