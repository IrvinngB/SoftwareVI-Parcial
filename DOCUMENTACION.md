# Documentación del Proyecto RunTracker

## Índice
1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Sistema de Almacenamiento](#sistema-de-almacenamiento)
4. [Pantallas de la Aplicación](#pantallas-de-la-aplicación)
5. [Generación de Frases Motivacionales](#generación-de-frases-motivacionales) 
6. [Manejo de Entrenamientos](#manejo-de-entrenamientos)
7. [Sistema de Metas](#sistema-de-metas)
8. [Componentes Principales](#componentes-principales)
9. [Recursos y Assets](#recursos-y-assets)
10. [Configuración del Proyecto](#configuración-del-proyecto)
11. [Dependencias](#dependencias)

## Descripción General

**RunTracker** es una aplicación móvil desarrollada con Expo y React Native que permite a los corredores registrar sus entrenamientos, establecer metas mensuales, visualizar su historial de carreras y recibir frases motivacionales. La aplicación utiliza un sistema de navegación basado en archivos con Expo Router y almacenamiento local para gestionar los datos del usuario.

## Estructura del Proyecto

## Estructura del Proyecto

El proyecto está organizado en las siguientes carpetas principales:

- **app/**: Contiene los archivos de la aplicación y la navegación utilizando Expo Router
  - **_layout.tsx**: Configuración principal del layout y navegación
  - **index.tsx**: Punto de entrada principal de la aplicación
  - **Carpetas específicas**: Cada pantalla principal tiene su propia carpeta (Bienvenida, Login, Registro, Principal, Historial, Metas, Frases)
- **assets/**: Recursos estáticos como imágenes, fuentes y datos JSON
  - **images/**: Imágenes utilizadas en la aplicación
  - **fonts/**: Tipografías personalizadas
  - **FrasesData/**: Archivo JSON con frases motivacionales
  - **Data/**: Otros archivos de datos
- **components/**: Componentes reutilizables de React
- **constants/**: Constantes de la aplicación como colores y temas
- **hooks/**: Custom hooks para la gestión de temas y estados
- **utils/**: Utilidades como funciones de almacenamiento

## Sistema de Almacenamiento

La aplicación utiliza dos métodos principales de almacenamiento:

### AsyncStorage
Se utiliza para datos simples y de acceso frecuente:

```javascript
// Guardar datos
await AsyncStorage.setItem('nombre_corredor', nombre);

// Leer datos
const nombreGuardado = await AsyncStorage.getItem('nombre_corredor');
```

Datos almacenados con AsyncStorage:
- Nombre del corredor
- Meta mensual actual
- Preferencias del usuario

### Sistema de Archivos (Expo FileSystem)
### Historial
Pantalla para visualizar el historial completo de entrenamientos:
- Lista de entrenamientos ordenados por fecha (más recientes primero)
- Detalles de cada entrenamiento: fecha, distancia, tiempo, ritmo y tipo
- Opción para eliminar entrenamientos individuales
- Visualización de estadísticas resumidas

### Frases
Sistema para visualizar y generar frases motivacionales:
- Muestra una frase aleatoria del conjunto de frases disponibles
- Botón para generar una nueva frase cuando el usuario lo desee
- Interfaz simple y enfocada en la motivación

## Generación de Frases Motivacionales

Las frases motivacionales se almacenan en un archivo JSON estático ubicado en `assets/FrasesData/Frases.json` con la siguiente estructura:

```json
[
  {
    "id": 1,
    "frase": "El único mal entrenamiento es el que no se hace."
  },
  {
    "id": 2,
    "frase": "Cada paso cuenta, no importa lo lento que vayas."
  },
  ...
]
```

El componente de frases implementa una función simple para seleccionar y mostrar aleatoriamente una frase del conjunto disponible:

```javascript
const mostrarFraseAleatoria = () => {
  const indiceAleatorio = Math.floor(Math.random() * frases.length);
  const nuevaFrase = frases[indiceAleatorio].frase;
  setFraseActual(nuevaFrase);
};
```

Este sistema permite mostrar frases aleatorias sin repetición inmediata, proporcionando motivación constante al usuario.

## Manejo de Entrenamientos

### Estructura de Datos de Entrenamiento

Cada entrenamiento se guarda como un objeto con la siguiente estructura:

```typescript
interface Entrenamiento {
  id: string;             // Identificador único
  fecha: string;          // Formato: DD-MM-YYYY
  distancia: number;      // En kilómetros
  tiempo: number;         // En minutos
  pace: string;           // Ritmo (min/km)
  tipoEntrenamiento: string; // Tipo de entrenamiento
}
```

### Proceso de Guardado

Cuando un usuario registra un nuevo entrenamiento:

1. Se crea un objeto con los datos del entrenamiento
2. Se genera un ID único
3. Se calcula automáticamente el ritmo (pace) en base a la distancia y tiempo
4. Se verifica la existencia del directorio de datos
5. Se lee el archivo de entrenamientos existente
6. Se agrega el nuevo entrenamiento al arreglo
7. Se guarda el arreglo actualizado en el archivo JSON

```javascript
// Proceso simplificado de guardado de entrenamiento
const guardarEntrenamiento = async (nuevoEntrenamiento) => {
  // Verificar directorio
  await ensureDirectoryExists();
  
  // Leer datos existentes
  let entrenamientos = [];
  const fileInfo = await FileSystem.getInfoAsync(STORAGE_PATHS.ENTRENAMIENTOS);
  if (fileInfo.exists) {
    const fileContent = await FileSystem.readAsStringAsync(STORAGE_PATHS.ENTRENAMIENTOS);
    if (fileContent) {
      entrenamientos = JSON.parse(fileContent);
    }
  }
  
  // Agregar y guardar
  entrenamientos.push(nuevoEntrenamiento);
  await FileSystem.writeAsStringAsync(
    STORAGE_PATHS.ENTRENAMIENTOS,
    JSON.stringify(entrenamientos)
  );
};
```

## Sistema de Metas

### Estructura de Datos de Metas

Cada meta se almacena con la siguiente estructura:

```typescript
interface Meta {
  id: number;                 // Identificador único
  nombre: string;             // Descripción de la meta
  distanciaObjetivo: number;  // En kilómetros
  fechaInicio: string;        // Formato: DD-MM-YYYY
  fechaFin: string;           // Formato: DD-MM-YYYY
  completada: boolean;        // Estado de la meta
}
```

### Proceso de Gestión de Metas

El sistema de metas funciona de la siguiente manera:

1. **Creación**: El usuario establece una distancia objetivo para un período de 30 días
2. **Almacenamiento**: La meta se guarda en `data/metas.json` con un ID único
3. **Seguimiento**: En la pantalla Principal y Metas se muestra el progreso actual
4. **Cálculo de Progreso**:
   - Se obtienen todos los entrenamientos del mes actual
   - Se suma la distancia total recorrida
   - Se calcula el porcentaje de cumplimiento respecto al objetivo
   
```javascript
// Cálculo de progreso de meta
const calcularDistanciaMensual = async () => {
  try {
    // Obtener entrenamientos
    const entrenamientos = await cargarEntrenamientos();
    
    // Filtrar por mes actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const anioActual = fechaActual.getFullYear();
    
    // Sumar distancias
    const distanciaMensual = entrenamientos
      .filter(entrenamiento => {
        const [dia, mes, anio] = entrenamiento.fecha.split('-').map(Number);
        return mes === mesActual && anio === anioActual;
      })
      .reduce((total, entrenamiento) => total + entrenamiento.distancia, 0);
    
    // Calcular porcentaje completado
    if (metaActual && Number(metaActual) > 0) {
      const porcentaje = (distanciaMensual / Number(metaActual)) * 100;
      setPorcentajeCompletado(Math.min(porcentaje, 100));
    }
  } catch (error) {
    console.error('Error al calcular distancia mensual:', error);
  }
};
```

## Componentes Principales

### Componentes UI Personalizados

- **ThemedView**: Componente de vista con soporte para temas claro/oscuro que adapta su apariencia automáticamente.
  ```typescript
  <ThemedView style={styles.container}>
    {/* Contenido */}
  </ThemedView>
  ```

- **ThemedText**: Componente de texto que aplica estilos según el tema actual.
  ```typescript
  <ThemedText style={styles.title} type="title">
    Título de la Sección
  </ThemedText>
  ```

- **ParallaxScrollView**: Componente que crea un efecto parallax con una imagen de cabecera cuando se desplaza.
  ```typescript
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
    {/* Contenido */}
  </ParallaxScrollView>
  ```

- **Nav**: Componente de navegación personalizado para moverse entre pantallas.

## Recursos y Assets

### Imágenes

La aplicación utiliza varias imágenes clave para mejorar la experiencia del usuario:

- **Imágenes de Cabecera**: Cada pantalla principal tiene su propia imagen de cabecera:
  - `Bienvenida.jpg`: Imagen de presentación para la pantalla inicial
  - `fondo.jpg`: Fondo para la pantalla Principal
  - `Historial.jpg`: Cabecera para la pantalla de historial
  - `Metas.jpg`: Cabecera para la pantalla de metas
  - `Frases.jpg`: Cabecera para la pantalla de frases motivacionales
  - `carrera.jpg`: Imagen utilizada en la pantalla de registro

- **Iconos**:
  - `icon.png`: Icono principal de la aplicación
  - `adaptive-icon.png`: Icono adaptativo para Android
  - `splash-icon.png`: Icono para la pantalla de carga

### Recursos de Datos

- **Frases.json**: Contiene todas las frases motivacionales disponibles en la aplicación.  ```json
  [
    {
      "id": 1,
      "frase": "El único mal entrenamiento es el que no se hace."
    },
    ...
  ]
  ```

## Configuración del Proyecto

### Configuración de Expo

El proyecto está configurado mediante el archivo `app.json`:

```json
{
  "expo": {
    "name": "RunTracker",
    "slug": "runtracker",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/android/play_store_512.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.runtracker"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android/res/mipmap-xxxhdpi/ic_launcher_foreground.png",
        "backgroundImage": "./assets/images/android/res/mipmap-xxxhdpi/ic_launcher_background.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.runtracker"
    },
    "web": {
      "bundler": "metro",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": ["expo-router"]
  }
}
```

### Configuración de TypeScript

El proyecto usa TypeScript con la siguiente configuración en `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

## Dependencias

El proyecto utiliza las siguientes dependencias principales:

```json
{
  "dependencies": {
    "@expo/vector-icons": "^14.0.0",
    "@react-native-async-storage/async-storage": "1.18.2",
    "@react-navigation/native": "^6.0.2",
    "expo": "~49.0.15",
    "expo-file-system": "~15.4.5",
    "expo-font": "~11.4.0",
    "expo-image": "~1.3.5",
    "expo-linking": "~5.0.2",
    "expo-router": "^2.0.0",
    "expo-splash-screen": "~0.20.5",
    "expo-status-bar": "~1.6.0",
    "expo-system-ui": "~2.4.0",
    "expo-web-browser": "~12.3.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.72.6"
  }
}
```

## Flujo de Trabajo de la Aplicación

1. **Inicio de la Aplicación**:
   - La aplicación comienza en la pantalla de Bienvenida
   - Si es la primera vez, el usuario se registra; si no, inicia sesión

2. **Registro de Usuario**:
   - El usuario proporciona su nombre
   - La información se guarda en AsyncStorage

3. **Pantalla Principal**:
   - Muestra el resumen de actividad
   - Calcula el progreso de la meta mensual
   - Ofrece acceso a todas las funcionalidades

4. **Registro de Entrenamientos**:
   - El usuario ingresa distancia, tiempo y tipo de entrenamiento
   - El sistema calcula automáticamente el ritmo
   - Los datos se guardan en el archivo de entrenamientos

5. **Gestión de Metas**:
   - El usuario puede crear una meta mensual
   - El sistema actualiza el progreso en tiempo real
   - Las metas se guardan en el archivo de metas

6. **Frases Motivacionales**:
   - El usuario puede generar frases motivacionales aleatorias
   - Las frases están predefinidas en el archivo JSON

## Conclusión

RunTracker es una aplicación completa para corredores que integra funcionalidades de registro, seguimiento y motivación. Su diseño modular y sistema de almacenamiento local permiten una experiencia fluida sin necesidad de conexión a internet constante. El sistema de temas claro/oscuro y las interfaces adaptativas garantizan una buena experiencia de usuario en diferentes condiciones de uso.
Pantalla para gestionar metas de entrenamiento con las siguientes características:
- Establecer una nueva meta mensual de distancia
- Ver metas actuales y su progreso
- Cancelar o marcar metas como completadas

### Historial
Muestra el historial de actividades y entrenamientos del usuario.

### Frases
Presenta frases motivacionales para los usuarios, obtenidas desde un archivo JSON.

## Recursos y Assets

### Imágenes
- **Pantallas**: Imágenes específicas para cada pantalla (Bienvenida.jpg, Metas.jpg, etc.)
- **Íconos**: Diferentes tamaños y formatos para Android e iOS
- **Logos**: Diversos recursos gráficos para la aplicación

### Datos
- **FrasesData/Frases.json**: Contiene las frases motivacionales mostradas en la app
- **Data/Data.json**: Almacena datos generales de la aplicación

### Fuentes
- **SpaceMono-Regular.ttf**: Fuente utilizada en la aplicación

## Configuración del Proyecto

### app.json
Configuración principal de Expo con las siguientes características:
- Nombre de la aplicación: "Pace & Progress"
- Configuraciones específicas para Android e iOS
- Configuración del splash screen
- Configuración de íconos adaptables

### eas.json
Configuración para Expo Application Services (EAS) para compilación, envío y actualizaciones.

### tsconfig.json
Configuración de TypeScript para el proyecto, gestionada automáticamente por Expo.

## Dependencias

### Principales
- **expo**: Framework para desarrollo multiplataforma
- **expo-router**: Sistema de navegación basado en archivos
- **react-native**: Framework de desarrollo móvil
- **@react-navigation**: Librería de navegación
- **@expo/vector-icons**: Conjunto de iconos
- **@react-native-async-storage/async-storage**: Almacenamiento persistente

### UI y Experiencia de Usuario
- **expo-blur**: Efectos de desenfoque
- **expo-haptics**: Retroalimentación háptica
- **expo-image**: Manejo optimizado de imágenes
- **react-native-gesture-handler**: Manejo avanzado de gestos
- **react-native-reanimated**: Animaciones fluidas
- **react-native-modal-datetime-picker**: Selector de fecha y hora

### Herramientas de Desarrollo
- **typescript**: Tipado estático
- **eslint**: Linting de código
- **@babel/core**: Transpilación de JavaScript

## Convenciones de Código

El proyecto utiliza TypeScript para tipado estático y sigue las convenciones de React y React Native. Los componentes están organizados en archivos individuales y se agrupan por funcionalidad.

La navegación se realiza mediante Expo Router, que permite una navegación basada en la estructura de archivos, similar a Next.js.

El almacenamiento local se maneja principalmente a través de AsyncStorage, encapsulado en funciones de utilidad en el archivo `utils/storage.ts`.

## Instrucciones para Desarrollo

Para iniciar el desarrollo:

1. Instalar dependencias: `npm install`
2. Iniciar la aplicación: `npx expo start`
3. Abrir en emulador: Presiona `a` para Android o `i` para iOS
4. Escanear QR para Expo Go: Utiliza la app Expo Go en tu dispositivo

---

*Documentación creada para el proyecto Pace & Progress - Junio 2025*
