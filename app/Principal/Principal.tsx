import Nav from '@/components/Nav';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { navigate } from 'expo-router/build/global-state/routing';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function PantallaPrincipal() {
  // Place all hooks at the top level
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  
  // Add state for the nombre input
  const [nombre, setNombre] = useState('');


// funcion para guardar el nombre y poder mostrarlo
  const cargarNombre = async () => {
    try{
        const nombreGuardado = await AsyncStorage.getItem('nombre_corredor');
        if(nombreGuardado !== null){
            setNombre(nombreGuardado);
        }

    }catch(error){
        console.error('Error al cargar el nombre: ', error)
    }
  };

  cargarNombre(); 
  
  const RegistrarNombre = async () =>{
    //poner codigo para cambiar de pantalla
  }
   const FrasesMoti = async () =>{
    //poner codigo para cambiar de pantalla
  } 
   const VerHistorial = async () =>{
    //poner codigo para cambiar de pantalla
  } 
   const VerMetas = async () =>{
    //poner codigo para cambiar de pantalla
  } 


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
        <ThemedText type="title" style={{ lineHeight: 40 }}>
            Bienvenido a Pace & Progress, {nombre}
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

     
      {/* Botón para registrar entrenamiento */}
      <TouchableOpacity 
        style={[styles.registrarButton, { backgroundColor: buttonColor }]} 
        onPress={RegistrarNombre}
      >
        <FontAwesome5 name="cash-register" size={16} color="#fff" style={styles.buttonIcon} />
        <ThemedText style={styles.loginButtonText}>
          Registrar Entrenamiento
        </ThemedText>
        
      </TouchableOpacity>

      {/* Botón para ver frases motivadoras */}

      <TouchableOpacity 
        style={[styles.frasesButton, { backgroundColor: buttonColor }]} 
        onPress={FrasesMoti}
      >
        <MaterialIcons name="link" size={16} color="#fff" style={styles.buttonIcon} />
        <ThemedText style={styles.loginButtonText}>
          Ver Frases Motivadoras
        </ThemedText>
      </TouchableOpacity>

      {/* Botón para ver historial */}
     
      <TouchableOpacity 
        style={[styles.registrarButton, { backgroundColor: buttonColor }]} 
        onPress={VerHistorial}
      >
        <FontAwesome5 name="cash-register" size={16} color="#fff" style={styles.buttonIcon} />
        <ThemedText style={styles.loginButtonText}>
          Ver Historial
        </ThemedText>
        
      </TouchableOpacity>

      {/* Botón para ver metas */}

      <TouchableOpacity 
        style={[styles.frasesButton, { backgroundColor: buttonColor }]} 
        onPress={VerMetas}
      >
        <MaterialIcons name="link" size={16} color="#fff" style={styles.buttonIcon} />
        <ThemedText style={styles.loginButtonText}>
          Ver Metas
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
  registrarButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
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
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  cardText: {
    lineHeight: 20,
  }
});