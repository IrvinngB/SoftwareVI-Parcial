import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { STORAGE_PATHS } from '@/utils/storage';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
// Definir el tipo para un entrenamiento
interface Entrenamiento {
    id: string;
    fecha: string;
    distancia: number;
    tiempo: number;
    pace: string;
    tipoEntrenamiento: string;
}

export default function HistorialScreen() {
    // Place all hooks at the top level
    const colorScheme = useColorScheme();
    const textColor = useThemeColor({}, 'text');

    // Estado para el nombre del corredor (para input y visualización)
    const [nombre, setNombre] = useState<string>('');
    const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Función para recuperar el nombre del corredor al cargar la pantalla
    const obtenerNombre = async (): Promise<void> => {
        try {
            const nombreGuardado = await AsyncStorage.getItem('nombre_corredor');
            if (nombreGuardado !== null) {
                setNombre(nombreGuardado);
            }
        } catch (error) {
            console.error('Error al recuperar el nombre:', error);
            Alert.alert('Error', 'No se pudo cargar tu nombre');
        }
    };

    // Funcion para obtener el historial de entrenamientos
    const cargarEntrenamientos = async (): Promise<Entrenamiento[]> => {
        setIsLoading(true);
        try {
            const jsonFilePath = STORAGE_PATHS.ENTRENAMIENTOS;
            const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);

            if (fileInfo.exists) {
                const fileContent = await FileSystem.readAsStringAsync(jsonFilePath);
                if (fileContent) {
                    const entrenamientosCargados: Entrenamiento[] = JSON.parse(fileContent);
                    console.log('Entrenamientos guardados:', entrenamientosCargados);

                    // Ordena los entrenamientos por fecha (más reciente primero)
                    entrenamientosCargados.sort((a: Entrenamiento, b: Entrenamiento) => {
                        // Convertir fechas en formato DD-MM-YYYY a objetos Date para comparar
                        const [dayA, monthA, yearA] = a.fecha.split('-');
                        const [dayB, monthB, yearB] = b.fecha.split('-');

                        const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
                        const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));

                        return dateB.getTime() - dateA.getTime(); // Orden descendente (más reciente primero)
                    });

                    setEntrenamientos(entrenamientosCargados);
                    return entrenamientosCargados;
                }
            } else {
                console.log('No existe archivo de entrenamientos todavía');
            }
            return [];
        } catch (error) {
            console.error('Error al cargar entrenamientos:', error);
            Alert.alert('Error', 'No se pudieron cargar los entrenamientos');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar datos cuando el componente se monta
    useEffect(() => {
        obtenerNombre();
        cargarEntrenamientos();
    }, []);

    // Función para eliminar un entrenamiento
    const eliminarEntrenamiento = async (id: string): Promise<void> => {
        try {
            const jsonFilePath = FileSystem.documentDirectory + 'entrenamientos.json';
            const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);

            if (fileInfo.exists) {
                const fileContent = await FileSystem.readAsStringAsync(jsonFilePath);
                if (fileContent) {
                    let entrenamientosList: Entrenamiento[] = JSON.parse(fileContent);

                    // Filtrar el entrenamiento a eliminar
                    entrenamientosList = entrenamientosList.filter((item: Entrenamiento) => item.id !== id);

                    // Guardar la lista actualizada
                    await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(entrenamientosList, null, 2));

                    // Actualizar el estado
                    setEntrenamientos(entrenamientosList);
                    Alert.alert('Éxito', 'Entrenamiento eliminado correctamente');
                }
            }
        } catch (error) {
            console.error('Error al eliminar entrenamiento:', error);
            Alert.alert('Error', 'No se pudo eliminar el entrenamiento');
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
            source={require('@/assets/images/Historial.jpg')}
            style={styles.headerImage}
          />
        }
            >
                {/* Contenedor de bienvenida */}
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title" style={{ lineHeight: 40 }}>
                        Bienvenido {nombre ? nombre : ""} a la ventana de Historial
                    </ThemedText>
                </ThemedView>

                {/* Tarjeta informativa sencilla */}
                <ThemedView style={[styles.card, {
                    backgroundColor: colorScheme === 'dark' ? Colors.palette.navy : Colors.palette.lightGray
                }]}>
                    <ThemedText style={styles.cardText}>
                        Aquí podrás visualizar el historial de tus entrenamientos y carreras.
                    </ThemedText>
                </ThemedView>

                {/* Mostrar tabla con entrenamientos */}
                <ThemedView style={styles.stepContainer}>
                    <ThemedText type="subtitle">Historial de Entrenamientos:</ThemedText>
                    <TouchableOpacity
                        style={[styles.loginButton, { backgroundColor: buttonColor }]}
                        onPress={cargarEntrenamientos}
                        disabled={isLoading}
                    >
                        <ThemedText style={styles.loginButtonText}>
                            {isLoading ? "Cargando..." : "Actualizar Entrenamientos"}
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {isLoading ? (
                    <ActivityIndicator size="large" color={buttonColor} style={styles.loading} />
                ) : entrenamientos.length > 0 ? (
                    <ThemedView style={styles.tableContainer}>
                        {/* Header row */}
                        <ThemedView style={[styles.tableRow, styles.tableHeader]}>
                            <ThemedText style={[styles.tableCell, styles.headerCell]}>Fecha</ThemedText>
                            <ThemedText style={[styles.tableCell, styles.headerCell]}>Tipo</ThemedText>
                            <ThemedText style={[styles.tableCell, styles.headerCell]}>Distancia (km)</ThemedText>
                            <ThemedText style={[styles.tableCell, styles.headerCell]}>Tiempo (min)</ThemedText>
                            <ThemedText style={[styles.tableCell, styles.headerCell]}>Ritmo (min/km)</ThemedText>

                            <ThemedText style={[styles.tableCell, styles.headerCell, styles.actionCell]}>Acción</ThemedText>
                        </ThemedView>

                        {/* Data rows */}
                        {entrenamientos.map((item: Entrenamiento) => (
                            <ThemedView key={item.id} style={styles.tableRow}>
                                <ThemedText style={styles.tableCell}>{item.fecha}</ThemedText>
                                <ThemedText style={styles.tableCell}>{item.tipoEntrenamiento || "N/A"}</ThemedText>
                                <ThemedText style={styles.tableCell}>{item.distancia}</ThemedText>
                                <ThemedText style={styles.tableCell}>{item.tiempo}</ThemedText>
                                <ThemedText style={styles.tableCell}>{item.pace}</ThemedText>
                                <TouchableOpacity
                                    style={[styles.tableCell, styles.deleteButton]}
                                    onPress={() => {
                                        Alert.alert(
                                            'Eliminar entrenamiento',
                                            '¿Estás seguro de que quieres eliminar este entrenamiento?',
                                            [
                                                { text: 'Cancelar', style: 'cancel' },
                                                { text: 'Eliminar', style: 'destructive', onPress: () => eliminarEntrenamiento(item.id) },
                                            ]
                                        );
                                    }}
                                >
                                    <AntDesign name="delete" size={16} color="#fff" />
                                </TouchableOpacity>
                            </ThemedView>
                        ))}
                    </ThemedView>
                ) : (
                    <ThemedText style={styles.noData}>
                        No hay entrenamientos registrados.
                    </ThemedText>
                )}
            </ParallaxScrollView>

            
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    tableContainer: {
        marginTop: 10,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 80, // Add space at bottom to prevent content from being hidden by nav
    },
     tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
    },
    tableHeader: {
        backgroundColor: Colors.palette.slateBlue,
    },
    tableCell: {
        flex: 1,
        padding: 6, // Reducir un poco el padding para acomodar más columnas
        textAlign: 'center',
        fontSize: 12, // Reducir el tamaño de la fuente para mejor visualización
    },
    headerCell: {
        fontWeight: 'bold',
        color: '#fff',
    },
    actionCell: {
        flex: 0.7,
    },
    deleteButton: {
        backgroundColor: '#ff4d4f',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        flex: 0.7,
        flexDirection: 'row', // Asegurar que el contenido se centre horizontalmente
        elevation: 4,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    noData: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
        marginBottom: 80,
    },
    fullScreenContainer: {
        flex: 1,
    },
    navContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    headerImage: {
    height: 200,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
    loading: {
        marginVertical: 20,
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
        marginHorizontal: 15,
    },
    cardText: {
        lineHeight: 20,
    }
});