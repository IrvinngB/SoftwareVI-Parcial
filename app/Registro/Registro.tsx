import Nav from '@/components/Nav'; // Asegúrate de que Nav esté importado
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'; // Importa TouchableOpacity si lo vas a usar

export default function HomeScreen() {
  // Place all hooks at the top level
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');

  // Estado para el nombre del corredor (para input y visualización)
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');


  // Función para recuperar el nombre del corredor al cargar la pantalla
  const obtenerNombre = async () => {
    try {
      const nombreGuardado = await AsyncStorage.getItem('nombre_corredor');
      if (nombreGuardado !== null) {
        setNombre(nombreGuardado);
      }
    } catch (error) {
      console.error('Error al recuperar el nombre:', error);
    }
  };

  useEffect(() => {
    obtenerNombre();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  // Determinar colores para elementos de la interfaz basados en el tema
  const inputBgColor = colorScheme === 'dark' ? Colors.palette.navy : '#fff';
  const inputBorderColor = colorScheme === 'dark' ? Colors.palette.slateBlue : Colors.palette.lightSlate;
  const placeholderColor = colorScheme === 'dark' ? Colors.palette.lightSlate : Colors.palette.slateBlue;
  const buttonColor = colorScheme === 'dark' ? Colors.palette.slateBlue : Colors.palette.slateBlue;
  

  return (
    // Envuelve todo en un único ThemedView que ocupe toda la pantalla
    <ThemedView style={styles.fullScreenContainer}>
      <ParallaxScrollView
        headerBackgroundColor={{
          light: Colors.palette.lightSlate,
          dark: Colors.palette.darkNavy
        }}
        headerImage={<ThemedView style={styles.headerImage} />}
      >
        {/* Contenedor de bienvenida */}
        <ThemedView style={styles.titleContainer}>
          {/* Ajusta el lineHeight si el texto sigue cortándose, o el fontSize en ThemedText */}
          <ThemedText type="title" style={{ lineHeight: 40 }}>
            Bienvenido {nombre ? nombre : ""} a la ventana de Registro
          </ThemedText>
        </ThemedView>

        {/* Tarjeta informativa sencilla */}
        <ThemedView style={[styles.card, {
          backgroundColor: colorScheme === 'dark' ? Colors.palette.navy : Colors.palette.lightGray
        }]}>
          <ThemedText style={styles.cardText}>
            Registra tus entrenamientos y carreras.
          </ThemedText>
        </ThemedView>

        {/* Contenedor de Fecha */}
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Ingresa fecha:</ThemedText>

          <TextInput
            style={[styles.input, {
              backgroundColor: inputBgColor,
              borderColor: inputBorderColor,
              color: textColor
            }]}
            value={fecha}
            onChangeText={setFecha}
            placeholder="Ejemplo: 10-05-2025"
            placeholderTextColor={placeholderColor}
            keyboardType="numeric"
            autoCapitalize="words"
          />
        </ThemedView>

        {/* Contenedor de distancia */}
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Ingresa la distancia (KM):</ThemedText>

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
          
        >
          {/* Asegúrate de tener AntDesign importado si usas este ícono */}
          {/* <AntDesign name="save" size={16} color="#fff" style={styles.buttonIcon} /> */}
          <ThemedText style={styles.loginButtonText}>
            Guardar Nombre
          </ThemedText>
        </TouchableOpacity>

      </ParallaxScrollView>

      {/* La barra de navegación debe estar fuera del ParallaxScrollView pero dentro del ThemedView principal */}
      <ThemedView style={styles.navContainer}>
        <Nav />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1, // Esto es crucial para que ocupe toda la pantalla
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0)', // Fondo transparente para la barra de navegación
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
    // Elimina minHeight para que el contenido decida la altura
    // minHeight: 80, // Comentado o eliminado
  },
  stepContainer: {
    gap: 8,
    marginBottom: 20,
  },
  headerImage: {
    height: 0,
    width: 0,
    bottom: 0,
    left: 0,
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
