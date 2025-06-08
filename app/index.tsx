import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { navigate } from 'expo-router/build/global-state/routing';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function Index() {
  // Place all hooks at the top level
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');

  // Estado para el nombre del corredor (para input y visualización)
  const [nombre, setNombre] = useState('');
  const [isChangingName, setIsChangingName] = useState(false);

  // Verificar si ya existe un nombre guardado cuando se carga la página
  useEffect(() => {
    const verificarNombre = async () => {
      try {
        const nombreGuardado = await AsyncStorage.getItem('nombre_corredor');
        if (nombreGuardado !== null && nombreGuardado.trim() !== '') {
          setNombre(nombreGuardado);
          setIsChangingName(true); // Indicar que estamos cambiando el nombre
        }
      } catch (error) {
        console.error('Error al verificar el nombre:', error);
      }
    };
    
    verificarNombre();
  }, []);

  // Función para guardar el nombre usando AsyncStorage
  const GuardarNombre = async () => {
    try {
      if (nombre.trim() === '') {
        // Considera usar un modal o un toast en lugar de alert() para mejor UX
        alert('Por favor ingrese un nombre');
        return;
      }
    
      await AsyncStorage.setItem('nombre_corredor', nombre);
      alert('Nombre guardado correctamente');
      
      // Siempre redirigir al Dashboard después de guardar el nombre
      navigate('/Principal/Principal' as any);
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
    // Envuelve todo en un único ThemedView que ocupe toda la pantalla
    <ThemedView style={styles.fullScreenContainer}>
      <ParallaxScrollView
        headerBackgroundColor={{
          light: Colors.palette.lightSlate,
          dark: Colors.palette.darkNavy
        }}
        headerImage={
          <Image
            source={require('@/assets/images/Bienvenida.jpg')}
            style={styles.headerImage}
          />
        }
      >
        {/* Contenedor de bienvenida */}
        <ThemedView style={styles.titleContainer}>
          {/* Ajusta el lineHeight si el texto sigue cortándose, o el fontSize en ThemedText */}
          <ThemedText type="title" style={{ lineHeight: 40 }}>
            {isChangingName ? 'Cambiar Nombre de Usuario' : 'Bienvenido a Pace & Progress'}
          </ThemedText>
        </ThemedView>

        {/* Tarjeta informativa sencilla */}
        <ThemedView style={[styles.card, {
          backgroundColor: colorScheme === 'dark' ? Colors.palette.navy : Colors.palette.lightGray
        }]}>
          <ThemedText style={styles.cardText}>
            {isChangingName 
              ? 'Ingresa tu nuevo nombre para continuar' 
              : 'Registra tu nombre para comenzar a monitorear tu progreso'}
          </ThemedText>
        </ThemedView>

        {/* Contenedor de instrucciones */}
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">
            {isChangingName ? 'Nuevo nombre:' : 'Ingresa el nombre del corredor'}
          </ThemedText>

          <TextInput
            style={[styles.input, {
              backgroundColor: inputBgColor,
              borderColor: inputBorderColor,
              color: textColor
            }]}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ejemplo: Juanito Alimaña"
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
            {isChangingName ? 'Actualizar Nombre' : 'Guardar Nombre'}
          </ThemedText>
        </TouchableOpacity>

        {/* Botón para cancelar solo si está cambiando el nombre */}
        {isChangingName && (
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: Colors.palette.lightSlate }]}
            onPress={() => navigate('/Principal/Principal' as any)}
          >
            <AntDesign name="close" size={16} color="#fff" style={styles.buttonIcon} />
            <ThemedText style={styles.loginButtonText}>
              Cancelar
            </ThemedText>
          </TouchableOpacity>
        )}

      </ParallaxScrollView>

      {/* La barra de navegación debe estar fuera del ParallaxScrollView pero dentro del ThemedView principal */}
      <ThemedView style={styles.navContainer}>
         
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
    elevation: 4,
  },
  cancelButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 4,
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
