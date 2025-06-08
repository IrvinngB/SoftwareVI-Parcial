import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { STORAGE_PATHS } from '@/utils/storage'; // Importa el archivo de utilidades de almacenamiento
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function RegistroScreen() {
  // Place all hooks at the top level
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');

  // Estado para el nombre del corredor (para input y visualización)
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [distancia, setDistancia] = useState('');
  const [time, setTime] = useState('');
  const [tipoEntrenamiento, setTipoEntrenamiento] = useState(''); // Estado para el tipo de entrenamiento
  
  // Estados para el DatePicker
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
  }, []);  // Función para manejar el cambio de fecha
  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    
    // Verificar que la fecha no sea futura
    const hoy = new Date();
    // Establecemos la hora al final del día para permitir el día actual
    hoy.setHours(23, 59, 59, 999);
    
    if (currentDate > hoy) {
      Alert.alert(
        "Fecha no válida", 
        "No puedes registrar entrenamientos con fechas futuras.",
        [{ text: "Entendido" }]
      );
      return;
    }
    
    setDate(currentDate);
    
    // Formato de fecha: DD-MM-YYYY
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexed
    const year = currentDate.getFullYear();
    
    setFecha(`${day}-${month}-${year}`);
  };
  
  // Función para mostrar el DatePicker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };  // Funcion para guardar el entrenamiento en un archivo
  const guardarEntrenamiento = async () => {
    try {
      // Validate input fields
      if (!fecha || !distancia || !time || !tipoEntrenamiento) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }
      
      // Crear la carpeta data si no existe
      const dataDir = FileSystem.documentDirectory + 'data/';
      const dirInfo = await FileSystem.getInfoAsync(dataDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dataDir, { intermediates: true });
      }
      
      const jsonFilePath = STORAGE_PATHS.ENTRENAMIENTOS;
      let entrenamientos = [];
      let maxId = 0;

      
      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(jsonFilePath);
        if (fileContent) {
          entrenamientos = JSON.parse(fileContent);
          // Find the highest existing ID
          if (entrenamientos.length > 0) {
            maxId = Math.max(...entrenamientos.map((item: { id: any; }) => item.id));
          }
        }
      }

      // Create new entry with auto-generated ID
      const nuevoEntrenamiento = {
        id: maxId + 1,
        
        fecha: fecha,
        distancia: parseFloat(distancia),
        tiempo: parseInt(time, 10),
        pace: (parseInt(time, 10) / parseFloat(distancia)).toFixed(2), // Calculate ritmo
        tipoEntrenamiento: tipoEntrenamiento // Add tipoEntrenamiento field
      };

      // Array y guardar el nuevo entrenamiento
      entrenamientos.push(nuevoEntrenamiento);
      await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(entrenamientos, null, 2));

      // Para verificar lo que se acaba de guardar
      try {
        const savedContent = await FileSystem.readAsStringAsync(jsonFilePath);
        console.log('Contenido actual del archivo:', JSON.parse(savedContent));
      } catch (error) {
        console.error('Error al leer el archivo guardado:', error);
      }

      
      setFecha('');
      setDistancia('');
      setTime('');
      setTipoEntrenamiento(''); 


      Alert.alert('Éxito', 'Entrenamiento guardado correctamente');
    } catch (error) {
      console.error('Error al guardar el entrenamiento:', error);
      Alert.alert('Error', 'Ocurrió un problema al guardar el entrenamiento');
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
            source={require('@/assets/images/carrera.jpg')}
            style={styles.headerImage}
          />
        }
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

          <TouchableOpacity 
            onPress={showDatepicker}
            style={[styles.input, {
              backgroundColor: inputBgColor,
              borderColor: inputBorderColor,
              justifyContent: 'center' // Para centrar el texto verticalmente
            }]}
          >
            <ThemedText>
              {fecha ? fecha : "Seleccionar fecha"}
            </ThemedText>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
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
            value={distancia}
            onChangeText={setDistancia}
            placeholder="Ejemplo: 5"
            placeholderTextColor={placeholderColor}
            keyboardType="numeric"
            autoCapitalize="words"
          />
        </ThemedView>

        {/* Contenedor de tiempo */}
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Ingresa el tiempo (Minutos  ):</ThemedText>

          <TextInput
            style={[styles.input, {
              backgroundColor: inputBgColor,
              borderColor: inputBorderColor,
              color: textColor
            }]}
            value={time}
            onChangeText={setTime}
            placeholder="Ejemplo: 76"
            placeholderTextColor={placeholderColor}
            keyboardType="numeric"
            autoCapitalize="words"
          />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Ingrese tipo de entrenamiento: </ThemedText>

          <TextInput
            style={[styles.input, {
              backgroundColor: inputBgColor,
              borderColor: inputBorderColor,
              color: textColor
            }]}
            value={tipoEntrenamiento}
            onChangeText={setTipoEntrenamiento}
            placeholder="Ejemplo: Carrera, Entrenamiento, Competencia"
            placeholderTextColor={placeholderColor}
            keyboardType="default"
            autoCapitalize="words"
          />
        </ThemedView>

        {/* Botón para guardar entrenamiento */}
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: buttonColor }]}
          onPress={guardarEntrenamiento}
        >
          <ThemedText style={styles.loginButtonText}>
            Registrar Entrenamiento
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
