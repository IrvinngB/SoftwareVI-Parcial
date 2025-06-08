import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { STORAGE_PATHS } from '@/utils/storage';
import AntDesign from '@expo/vector-icons/AntDesign'; //icono de metas
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto'; //icono de historial 
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; //icono de frases motivadoras
import AsyncStorage from '@react-native-async-storage/async-storage'; //icono de registrar entrenamiento
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { navigate } from 'expo-router/build/global-state/routing';
import React, { useEffect, useState } from 'react';
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
  // Estados para las fechas de la meta
  const [fechaInicioMeta, setFechaInicioMeta] = useState<string | null>(null);
  const [fechaFinMeta, setFechaFinMeta] = useState<string | null>(null);

  // Función para cargar la meta mensual
  const cargarMetaMensual = async () => {
    try {
      const metaGuardada = await AsyncStorage.getItem('meta_mensual');
      const fechaInicio = await AsyncStorage.getItem('fecha_inicio_meta');
      const fechaFin = await AsyncStorage.getItem('fecha_fin_meta');
      
      if (metaGuardada !== null) {
        setMetaActual(metaGuardada);
      }
      
      if (fechaInicio !== null) {
        setFechaInicioMeta(fechaInicio);
      }
      
      if (fechaFin !== null) {
        setFechaFinMeta(fechaFin);
      }
    } catch (error) {
      console.error('Error al recuperar la meta mensual:', error);
    }
  };  // Función para calcular la distancia total recorrida en el rango de fechas de la meta
  const calcularDistanciaMensual = async () => {
    try {
      console.log('Calculando distancia mensual y progreso de meta...');
      const jsonFilePath = STORAGE_PATHS.ENTRENAMIENTOS;
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);

      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(jsonFilePath);
        if (fileContent) {
          const entrenamientos: Entrenamiento[] = JSON.parse(fileContent);
          let distanciaCalculada = 0;
          
          // Si no hay fechas de meta definidas, usar el mes actual (comportamiento anterior)
          if (!fechaInicioMeta || !fechaFinMeta) {
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth() + 1; // JavaScript months are 0-indexed
            const anioActual = fechaActual.getFullYear();
              // Filtrar entrenamientos del mes actual y sumar distancias
            distanciaCalculada = entrenamientos
              .filter(entrenamiento => {
                // Formato de fecha del entrenamiento: DD-MM-YYYY
                const [, mes, anio] = entrenamiento.fecha.split('-').map(Number);
                return mes === mesActual && anio === anioActual;
              })
              .reduce((total, entrenamiento) => total + entrenamiento.distancia, 0);
          } else {
            // Convertir fechas de la meta a objetos Date para comparación
            const fechaInicio = convertirFechaStringADate(fechaInicioMeta);
            const fechaFin = convertirFechaStringADate(fechaFinMeta);
            
            if (fechaInicio && fechaFin) {
              // Siempre calcular la distancia total de los entrenamientos dentro del rango,
              // independientemente de la fecha actual
              const entrenamientosFiltrados = entrenamientos.filter(entrenamiento => {
                const fechaEntrenamiento = convertirFechaStringADate(entrenamiento.fecha);
                // Solo incluir entrenamientos que estén dentro del rango de fechas
                return fechaEntrenamiento && 
                      fechaEntrenamiento >= fechaInicio && 
                      fechaEntrenamiento <= fechaFin;
              });
              
              // Calcular la suma de distancias de los entrenamientos filtrados
              distanciaCalculada = entrenamientosFiltrados
                .reduce((total, entrenamiento) => total + entrenamiento.distancia, 0);
            }
          }
          
          // Actualizar la distancia total
          setDistanciaTotal(distanciaCalculada);
          
          // Luego calcular el porcentaje en una función separada
          calcularPorcentajeMeta(distanciaCalculada);          // Ahora calcularPorcentajeMeta es llamado desde calcularDistanciaMensual
        }
      }
    } catch (error) {
      console.error('Error al calcular distancia mensual:', error);
    }
  };
  
  // Nueva función separada para calcular el porcentaje de la meta
  const calcularPorcentajeMeta = (distancia: number) => {
    if (metaActual && Number(metaActual) > 0) {
      // Verificar si estamos dentro del rango de fechas de la meta
      if (fechaInicioMeta && fechaFinMeta) {
        const fechaInicio = convertirFechaStringADate(fechaInicioMeta);
        const fechaFin = convertirFechaStringADate(fechaFinMeta);
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0); // Normalizar la hora
        
        if (fechaInicio && fechaFin) {
          // Si la fecha actual es anterior al inicio de la meta
          if (fechaActual < fechaInicio) {
            // La meta aún no ha comenzado, siempre mostrar 0%
            // Independientemente de la distancia recorrida (corrige el bug)
            setPorcentajeCompletado(0);
            return;
          }
          
          // Si la fecha actual es posterior al fin de la meta
          if (fechaActual > fechaFin) {
            // La meta ya terminó, calcular porcentaje final sin ajustes por tiempo
            // Simplemente muestra el porcentaje real completado de la meta
            const porcentaje = (distancia / Number(metaActual)) * 100;
            setPorcentajeCompletado(Math.min(porcentaje, 100));
            return;
          }
          
          // Si estamos dentro del periodo de la meta, calcular porcentaje 
          // considerando el tiempo transcurrido
          const totalDias = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24);
          const diasTranscurridos = (fechaActual.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24);
          
          // Calcular el progreso esperado basado en el tiempo transcurrido
          const progresoEsperado = (diasTranscurridos / totalDias) * Number(metaActual);
          
          let porcentaje;
          if (distancia >= progresoEsperado) {
            // Si estamos adelantados o a tiempo
            porcentaje = (distancia / Number(metaActual)) * 100;
          } else {
            // Si estamos atrasados, calcular en función del progreso esperado
            porcentaje = (distancia / progresoEsperado) * 100;
          }
          setPorcentajeCompletado(Math.min(porcentaje, 100));
          return;
        }
      }
      
      // Si no hay fechas o hay error en el formato, usar cálculo simple
      // Este caso solo debe ejecutarse cuando no tenemos información de fechas
      const porcentaje = (distancia / Number(metaActual)) * 100;
      setPorcentajeCompletado(Math.min(porcentaje, 100));
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
    
  // Usar useEffect para calcular distancia cuando cambian los parámetros de la meta  
  useEffect(() => {
    // Esta función se ejecuta cuando cambia alguno de los valores en el array de dependencias
    calcularDistanciaMensual();
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [metaActual, fechaInicioMeta, fechaFinMeta]);
    // Usar useFocusEffect para actualizar los datos cada vez que se regresa a esta pantalla
  // Esto garantiza que los datos se actualizarán cuando se registre un nuevo entrenamiento
  useFocusEffect(
    React.useCallback(() => {
      // Cuando la pantalla recibe el foco, recalcular la distancia mensual y el porcentaje
      console.log('La pantalla Principal recibió el foco - actualizando datos');
      
      // Cargar meta actualizada y luego calcular distancia
      const actualizarDatos = async () => {
        await cargarMetaMensual(); // Asegurarse de tener los datos más recientes de la meta
        await calcularDistanciaMensual(); // Luego calcular la distancia y el porcentaje
      };
      
      actualizarDatos();
      
      return () => {
        // Opcional: Limpieza cuando la pantalla pierde el foco
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

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
  const buttonColor = Colors.palette.slateBlue; // El mismo color para ambos temas
  const progressBarColor = porcentajeCompletado >= 100 
    ? '#4CAF50' // Verde para meta completada
    : Colors.palette.slateBlue; // Color normal para meta en progreso
  const progressBackgroundColor = colorScheme === 'dark' 
    ? 'rgba(255,255,255,0.2)' 
    : 'rgba(0,0,0,0.1)';
    // Función auxiliar para convertir string de fecha a objeto Date
  const convertirFechaStringADate = (fechaString: string): Date | null => {
    try {
      // Formato esperado: DD-MM-YYYY
      const [dia, mes, anio] = fechaString.split('-').map(Number);
      // Nota: en Date, el mes es 0-indexed
      const fecha = new Date(anio, mes - 1, dia);
      fecha.setHours(0, 0, 0, 0); // Normalizar la hora para comparaciones exactas
      return fecha;
    } catch (error) {
      console.error('Error al convertir fecha:', error);
      return null;
    }
  };

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
    elevation: 4,
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
    elevation: 4,
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