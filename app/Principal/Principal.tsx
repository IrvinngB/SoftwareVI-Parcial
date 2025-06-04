import Nav from '@/components/Nav';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import AntDesign from '@expo/vector-icons/AntDesign'; //icono de metas
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto'; //icono de historial 
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; //icono de frases motivadoras
import AsyncStorage from '@react-native-async-storage/async-storage'; //icono de registrar entrenamiento
import { Image } from 'expo-image';
import { navigate } from 'expo-router/build/global-state/routing';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';




export default function Dashboard() {
  

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
  
  //codigo que envia a pantalla de registrar nombre
  const RegistrarNombre = async () =>{
    //poner codigo para cambiar de pantalla
  }
  //codigo que envia a pantalla de frases motivadoras
   const FrasesMoti = async () =>{
    //poner codigo para cambiar pantalla
    
  } 
  //codigogo que envia a pantalla de historial
   const VerHistorial = async () =>{
    //poner codigo para cambiar de pantalla
  } 
  //codigo que envia a la pantalla de ventas
   const VerMetas = async () =>{
    navigate('/Metas/Metas');
  } 


  // Determinar colores para elementos de la interfaz basados en el tema
  const inputBgColor = colorScheme === 'dark' ? Colors.palette.navy : '#fff';
  const inputBorderColor = colorScheme === 'dark' ? Colors.palette.slateBlue : Colors.palette.lightSlate;
  const placeholderColor = colorScheme === 'dark' ? Colors.palette.lightSlate : Colors.palette.slateBlue;
  const buttonColor = colorScheme === 'dark' ? Colors.palette.slateBlue : Colors.palette.slateBlue;
  
  return (
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
      }>

      {/* Contenedor de bienvenida */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.tituloCentrado}>
            Bienvenido a Pace & Progress, {nombre}
        </ThemedText>
      </ThemedView>

      

    <View style={styles.botonesContainer}>
     
      {/* Botón para registrar entrenamiento */}
      <TouchableOpacity 
        style={[styles.botonCuadro, { backgroundColor: buttonColor }]} 
        onPress={RegistrarNombre}
      >
        <FontAwesome5 name="cash-register" size={16} color="#fff" style={styles.buttonIcon} />
        <ThemedText style={styles.loginButtonText}>
          Registrar Entrenamiento
        </ThemedText>
        
      </TouchableOpacity>

      {/* Botón para ver frases motivadoras */}

      <TouchableOpacity 
        style={[styles.botonCuadro, { backgroundColor: buttonColor }]} 
        onPress={FrasesMoti}
      >
        <MaterialIcons name="emoji-emotions" size={16} color="#fff" style={styles.buttonIcon} />
        <ThemedText style={styles.loginButtonText}>
          Ver Frases Motivadoras
        </ThemedText>
      </TouchableOpacity>

      {/* Botón para ver historial */}
     
      <TouchableOpacity 
        style={[styles.botonCuadro, { backgroundColor: buttonColor }]} 
        onPress={VerHistorial}
      >
        <Fontisto name="history" size={16} color="#fff" style={styles.buttonIcon} />
        <ThemedText style={styles.loginButtonText}>
          Ver Historial
        </ThemedText>
        
      </TouchableOpacity>

      {/* Botón para ver metas */}

      <TouchableOpacity 
        style={[styles.botonCuadro, { backgroundColor: buttonColor }]} 
        onPress={VerMetas}
      >
        <AntDesign name="star" size={16} color="#fff" style={styles.buttonIcon} />
        <ThemedText style={styles.loginButtonText}>
          Ver Metas
        </ThemedText>
      </TouchableOpacity>
    </View>
    </ParallaxScrollView>
      <ThemedView style={styles.navContainer}>
          <Nav />
        </ThemedView>

    </ThemedView>
  );
}


const styles = StyleSheet.create({
   fullScreenContainer: {
     flex: 1, // esto hace que ocupe toda la pantalla
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,

  },
  tituloCentrado: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight:20
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
  botonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  botonCuadro: {
    width: '48%',
    aspectRatio: 1, 
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 5,
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