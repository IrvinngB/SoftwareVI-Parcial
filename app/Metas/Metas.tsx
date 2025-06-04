import Nav from '@/components/Nav'; // Asegúrate de que Nav esté importado
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign } from '@expo/vector-icons'; // Asegúrate de que AntDesign esté importado
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { navigate } from 'expo-router/build/global-state/routing'; //importa el navigate para cambiar de pantalla
import { useState } from 'react'; // Importa useEffect
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function MetaScreen() {
  // Place all hooks at the top level
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');

  // Estado para el nombre del corredor (para input y visualización)
  const [nombre, setNombre] = useState('');

  // Función para guardar el nombre usando AsyncStorage
  const GuardarNombre = async () => {
    try {
      if (nombre.trim() === '') {
        // Considera usar un modal o un toast en lugar de alert() para mejor UX
        alert('Por favor ingrese un nombre');
        return;
      }
    
      navigate('/Principal/Principal')
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
    // Envuelve todo en un único ThemedView que ocupe toda la pantalla
    <ThemedView style={styles.fullScreenContainer}>
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
        }
      
      >
        {/* Contenedor de bienvenida */}
        <ThemedView style={styles.titleContainer}>
          {/* Ajusta el lineHeight si el texto sigue cortándose, o el fontSize en ThemedText */}
          <ThemedText type="title" style={{ lineHeight: 40 }}>
            Bienvenido a Pace & Progress
          </ThemedText>
        </ThemedView>

        {/* Tarjeta informativa sencilla */}
        <ThemedView style={[styles.card, {
          backgroundColor: colorScheme === 'dark' ? Colors.palette.navy : Colors.palette.lightGray
        }]}>
          <ThemedText style={styles.cardText}>
            Registra tu nombre para comenzar a monitorear tu progreso
          </ThemedText>
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
  headerImage: {
    height: 200,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
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
