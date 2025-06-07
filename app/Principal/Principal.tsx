import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import AntDesign from '@expo/vector-icons/AntDesign'; //icono de metas
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto'; //icono de historial 
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; //icono de frases motivadoras
import AsyncStorage from '@react-native-async-storage/async-storage'; //icono de registrar entrenamiento
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { navigate } from 'expo-router/build/global-state/routing';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';


// Definir el tipo para un entrenamiento (igual que en Historial.tsx)
interface Entrenamiento {
    id: string;
    fecha: string;
    distancia: number;
    tiempo: number;
    pace: string;
}

export default function Dashboard() {
  // Place all hooks at the top level
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  
  // Add state for the nombre input
  const [nombre, setNombre] = useState('');
  // Nuevos estados para la meta y el progreso
  const [metaActual, setMetaActual] = useState('0');
  const [distanciaTotal, setDistanciaTotal] = useState(0);
  const [porcentajeCompletado, setPorcentajeCompletado] = useState(0);

  // Función para cargar la meta mensual
  const cargarMetaMensual = async () => {
    try {
      const metaGuardada = await AsyncStorage.getItem('meta_mensual');
      if (metaGuardada !== null) {
        setMetaActual(metaGuardada);
      }
    } catch (error) {
      console.error('Error al recuperar la meta mensual:', error);
    }
  };

  // Función para calcular la distancia total recorrida en el mes actual
  const calcularDistanciaMensual = async () => {
    try {
      const jsonFilePath = FileSystem.documentDirectory + 'data/entrenamientos.json';
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);

      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(jsonFilePath);
        if (fileContent) {
          const entrenamientos: Entrenamiento[] = JSON.parse(fileContent);
          
          // Obtener fecha actual para filtrar sólo entrenamientos del mes actual
          const fechaActual = new Date();
          const mesActual = fechaActual.getMonth() + 1; // JavaScript months are 0-indexed
          const anioActual = fechaActual.getFullYear();
          
          // Filtrar entrenamientos del mes actual y sumar distancias
          const distanciaMensual = entrenamientos
            .filter(entrenamiento => {
              // Formato de fecha del entrenamiento: DD-MM-YYYY
              const [dia, mes, anio] = entrenamiento.fecha.split('-').map(Number);
              return mes === mesActual && anio === anioActual;
            })
            .reduce((total, entrenamiento) => total + entrenamiento.distancia, 0);
          
          setDistanciaTotal(distanciaMensual);
          
          // Calcular porcentaje completado
          if (metaActual && Number(metaActual) > 0) {
            const porcentaje = (distanciaMensual / Number(metaActual)) * 100;
            // Limitar a máximo 100%
            setPorcentajeCompletado(Math.min(porcentaje, 100));
          }
        }
      }
    } catch (error) {
      console.error('Error al calcular distancia mensual:', error);
    }
  };

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
  
  // Usar useEffect para cargar datos cuando se monta el componente
  useEffect(() => {
    cargarNombre();
    cargarMetaMensual();
  }, []);

  // Usar useEffect para calcular distancia cuando cambia la meta actual
  useEffect(() => {
    calcularDistanciaMensual();
  }, [metaActual]);

  //codigo que envia a pantalla de registrar nombre
  const RegistrarEntreno = async () =>{
    navigate('/Registro/Registro' as any); // Cambia a la pantalla de registrar entrenamiento
  }
  //codigo que envia a pantalla de frases motivadoras
   const FrasesMoti = async () =>{
    navigate('/Frases/Frases' as any); // Cambia a la pantalla de frases motivadoras
  } 
  //codigogo que envia a pantalla de historial
   const VerHistorial = async () =>{
    navigate('/Historial/Historial' as any); // Cambia a la pantalla de historial
  } 
  //codigo que envia a la pantalla de ventas
   const VerMetas = async () =>{
    navigate('/Metas/Metas' as any); // Cambia a la pantalla de metas
  } 

  // Determinar colores para elementos de la interfaz basados en el tema
  const inputBgColor = colorScheme === 'dark' ? Colors.palette.navy : '#fff';
  const inputBorderColor = colorScheme === 'dark' ? Colors.palette.slateBlue : Colors.palette.lightSlate;
  const placeholderColor = colorScheme === 'dark' ? Colors.palette.lightSlate : Colors.palette.slateBlue;
  const buttonColor = colorScheme === 'dark' ? Colors.palette.slateBlue : Colors.palette.slateBlue;
  const progressBarColor = porcentajeCompletado >= 100 
    ? '#4CAF50' // Verde para meta completada
    : Colors.palette.slateBlue; // Color normal para meta en progreso
  const progressBackgroundColor = colorScheme === 'dark' 
    ? 'rgba(255,255,255,0.2)' 
    : 'rgba(0,0,0,0.1)';
  
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
      
      {/* Nuevo componente para mostrar el progreso de la meta */}
      {Number(metaActual) > 0 && (
        <ThemedView style={[styles.progressCard, {
          backgroundColor: colorScheme === 'dark' ? Colors.palette.navy : Colors.palette.lightGray
        }]}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'baseline', 
              marginBottom: 10 
            }}>
              <Entypo 
                name="calendar" 
                size={16} 
                color={textColor} 
                style={{ marginRight: 10, marginTop: 2 }} 
              />
              <ThemedText style={styles.progressTitle}>
                Progreso de tu meta mensual
              </ThemedText>
            </View>
          
          <ThemedText style={styles.progressDetails}>
            {distanciaTotal.toFixed(1)} KM de {metaActual} KM ({porcentajeCompletado.toFixed(1)}%)
          </ThemedText>
          
          {/* Barra de progreso */}
          <View style={[styles.progressBarContainer, {
            backgroundColor: progressBackgroundColor
          }]}>
            <View 
              style={[styles.progressBarFill, { 
                width: `${porcentajeCompletado}%`,
                backgroundColor: progressBarColor
              }]} 
            />
          </View>
          
          <ThemedText style={styles.progressMessage}>
            {porcentajeCompletado >= 100 
              ? '¡Felicidades! Has alcanzado tu meta mensual.' 
              : `Faltan ${(Number(metaActual) - distanciaTotal).toFixed(1)} KM para completar tu meta.`}
          </ThemedText>
        </ThemedView>
      )}

    <View style={styles.botonesContainer}>
     
      {/* Botón para registrar entrenamiento */}
      <TouchableOpacity 
        style={[styles.botonCuadro, { backgroundColor: buttonColor }]} 
        onPress={RegistrarEntreno}
      >
        <FontAwesome5 name="running" size={16} color="#fff" style={styles.buttonIcon} />
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
   loginButtonText: {
     color: '#fff', // Color blanco para el texto
     fontSize: 12,
     fontWeight: 'bold',
     textAlign: 'center',
     
   },
   buttonIcon: {
     marginRight: 8,
   },
   botonCuadro: {
    padding: 14,
    borderRadius: 8,
    width: '100%', // Ancho completo para los botones
    alignItems: 'center',
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  botonesContainer: {
    padding: 20,
    width: '100%',
  },
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
  // Nuevos estilos para la sección de progreso
  progressCard: {
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressDetails: {
    fontSize: 16,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    width: '100%',
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  }
});