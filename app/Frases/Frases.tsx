import frases from '@/assets/FrasesData/Frases.json'; //importar el archivo JSON con las frases
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign } from '@expo/vector-icons'; // Asegúrate de que AntDesign esté importado
import { Image } from 'expo-image';
import { useState } from 'react'; // Importa useEffect
import { StyleSheet, TouchableOpacity } from 'react-native';


export default function FrasesScreen() {
  // Place all hooks at the top level
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');

  // Estado para almacenar la frase actual
  const [fraseActual, setFraseActual] = useState('');

  const mostrarFraseAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    const nuevaFrase = frases[indiceAleatorio].frase;
    setFraseActual(nuevaFrase);
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
            source={require('@/assets/images/Frases.jpg')}
            style={styles.headerImage}
          />
        }
      
      >
        {/* Contenedor de bienvenida */}
        <ThemedView style={styles.titleContainer}>
          {/* Ajusta el lineHeight si el texto sigue cortándose, o el fontSize en ThemedText */}
          <ThemedText type="title" style={{ lineHeight: 40 }}>
            Frase Motivacional
          </ThemedText>
        </ThemedView>

        {/* Tarjeta informativa sencilla */}
        <ThemedView style={[styles.card, {
          backgroundColor: colorScheme === 'dark' ? Colors.palette.navy : Colors.palette.lightGray
        }]}>
          <ThemedText style={styles.cardText} >
             {fraseActual || 'Presiona el botón para recibir una frase motivacional.'}
          </ThemedText>
        </ThemedView>


        {/* Botón para generar nueva frase */}
        <TouchableOpacity
          style={[styles.frasesButton, { backgroundColor: buttonColor }]}
          onPress={mostrarFraseAleatoria}
        >
          <AntDesign name="save" size={16} color="#fff" style={styles.buttonIcon} />
          <ThemedText style={styles.loginButtonText}>
            Generar Frase
          </ThemedText>
        </TouchableOpacity>

      </ParallaxScrollView>

      
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
  frasesButton: {
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
    padding: 60,
    borderRadius: 8,
    marginBottom: 15,
  },
  cardText: {
    lineHeight: 20,
    fontSize: 18,
    textAlign: 'center',
  }
});
