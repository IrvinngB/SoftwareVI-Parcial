import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function MetasScreen() {
  // Place all hooks at the top level
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');

  // Estado para el nombre del corredor (para visualización)
  const [nombre, setNombre] = useState('');
    // Estado para la meta mensual
  const [metaMensual, setMetaMensual] = useState('');
  const [metaActual, setMetaActual] = useState('');
  const [showMetaInput, setShowMetaInput] = useState(false);
  const [metas, setMetas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

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
  
  // Función para obtener la meta mensual guardada
  const obtenerMetaMensual = async () => {
    try {
      const metaGuardada = await AsyncStorage.getItem('meta_mensual');
      if (metaGuardada !== null) {
        setMetaActual(metaGuardada);
      }
    } catch (error) {
      console.error('Error al recuperar la meta mensual:', error);
    }
  };
    // Función para guardar la meta mensual
  const guardarMetaMensual = async () => {
    try {
      if (!metaMensual) {
        Alert.alert('Error', 'Por favor ingresa una meta');
        return;
      }
      
      // Crear la carpeta data si no existe
      const dataDir = FileSystem.documentDirectory + 'data/';
      const dirInfo = await FileSystem.getInfoAsync(dataDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dataDir, { intermediates: true });
      }
      
      const jsonFilePath = dataDir + 'metas.json';
      let metas = [];
      let maxId = 0;
      
      // Check if file exists and read current data
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(jsonFilePath);
        if (fileContent) {
          metas = JSON.parse(fileContent);
          // Find the highest existing ID
          if (metas.length > 0) {
            maxId = Math.max(...metas.map((item: { id: any; }) => item.id));
          }
        }
      }
      
      // Create meta with start date (today) and end date (30 days from now)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      
      // Format dates
      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      
      const nuevaMeta = {
        id: maxId + 1,
        nombre: `Meta mensual de ${nombre}`,
        distanciaObjetivo: parseFloat(metaMensual),
        fechaInicio: formatDate(startDate),
        fechaFin: formatDate(endDate),
        tipoEntrenamiento: 'Todos' // Por defecto incluye todos los tipos
      };
      
      // Add to array and save
      metas.push(nuevaMeta);
      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(metas, null, 2));
      
      await AsyncStorage.setItem('meta_mensual', metaMensual);
      setMetaActual(metaMensual);
      setMetaMensual('');
      setShowMetaInput(false);
      Alert.alert('Éxito', 'Meta mensual guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la meta mensual:', error);
      Alert.alert('Error', 'Ocurrió un problema al guardar la meta mensual');
    }
  };
  // Función para cargar las metas desde el archivo
  const cargarMetas = async () => {
    try {
      setCargando(true);
      const dataDir = FileSystem.documentDirectory + 'data/';
      const jsonFilePath = dataDir + 'metas.json';
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      
      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(jsonFilePath);
        if (fileContent) {
          const metasCargadas = JSON.parse(fileContent);
          setMetas(metasCargadas);
          return metasCargadas;
        }
      }
      setCargando(false);
      return [];
    } catch (error) {
      console.error('Error al cargar metas: ', error);
      setCargando(false);
      return [];
    }
  };
  useEffect(() => {
    obtenerNombre();
    obtenerMetaMensual();
    cargarMetas();
  }, []);

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
        

        {/* Tarjeta informativa para meta mensual */}
        <ThemedView style={[styles.card, {
          backgroundColor: colorScheme === 'dark' ? Colors.palette.navy : Colors.palette.lightGray
        }]}>
          <ThemedText style={styles.cardText}>
            Establece tu meta mensual de kilómetros para correr.
          </ThemedText>
          
          {metaActual ? (
            <ThemedView style={styles.metaActualContainer}>
              <ThemedText type="subtitle" style={styles.metaActualText}>
                Tu meta actual: {metaActual} KM por mes
              </ThemedText>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: buttonColor }]}
                onPress={() => setShowMetaInput(true)}
              >
                <ThemedText style={styles.smallButtonText}>
                  Cambiar
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ) : (
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: buttonColor, marginTop: 10 }]}
              onPress={() => setShowMetaInput(true)}
            >
              <ThemedText style={styles.loginButtonText}>
                Establecer Meta Mensual
              </ThemedText>
            </TouchableOpacity>
          )}
          
          {showMetaInput && (
            <ThemedView style={styles.metaInputContainer}>
              <TextInput
                style={[styles.input, {
                  backgroundColor: inputBgColor,
                  borderColor: inputBorderColor,
                  color: textColor
                }]}
                value={metaMensual}
                onChangeText={setMetaMensual}
                placeholder="Ejemplo: 80"
                placeholderTextColor={placeholderColor}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: buttonColor, marginTop: 10 }]}
                onPress={guardarMetaMensual}
              >
                <ThemedText style={styles.loginButtonText}>
                  Guardar Meta
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}        
        </ThemedView>

        {/* Sección para mostrar las metas guardadas */}
        <ThemedView style={[styles.card, {
          backgroundColor: colorScheme === 'dark' ? Colors.palette.navy : Colors.palette.lightGray,
          marginTop: 20
        }]}>
          <ThemedText style={styles.cardTitle}>Tus Metas</ThemedText>
          
          {metas.length > 0 ? (
            metas.map((meta, index) => (
              <ThemedView 
                key={meta.id} 
                style={[
                  styles.metaItem,
                  // CORRECCIÓN: Usar un array condicional en lugar de operador &&
                  ...(index < metas.length - 1 ? [styles.metaItemBorder] : [])
                ]}
              >
                <ThemedText style={styles.metaNombre}>{meta.nombre}</ThemedText>
                <ThemedText style={styles.metaDetail}>Objetivo: {meta.distanciaObjetivo} KM</ThemedText>
                <ThemedText style={styles.metaDetail}>Periodo: {meta.fechaInicio} al {meta.fechaFin}</ThemedText>
                <ThemedText style={styles.metaDetail}>
                  Tipo: {meta.tipoEntrenamiento || 'Todos'}
                </ThemedText>
              </ThemedView>
            ))
          ) : cargando ? (
            <ThemedText style={styles.metaEmpty}>Cargando metas...</ThemedText>
          ) : (
            <ThemedText style={styles.metaEmpty}>No has creado ninguna meta aún.</ThemedText>
          )}
        </ThemedView>      
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
  },  // Estilos nuevos para la sección de metas
  metaActualContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 10,
    borderRadius: 8,
  },
  metaActualText: {
    fontWeight: 'bold',
  },
  smallButton: {
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metaInputContainer: {
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  metaItem: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  metaItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 10,
  },
  metaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metaDetail: {
    fontSize: 14,
    marginBottom: 3,
    opacity: 0.8,
  },
  metaEmpty: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
    marginVertical: 10,
  }
});