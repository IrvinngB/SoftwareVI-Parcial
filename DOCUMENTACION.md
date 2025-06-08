# Documentación del Proyecto Peace & Progress

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

**Peace & Progress** es una aplicación móvil desarrollada con Expo y React Native que permite a los corredores registrar sus entrenamientos, establecer metas mensuales, visualizar su historial de carreras y recibir frases motivacionales. La aplicación utiliza un sistema de navegación basado en archivos con Expo Router y almacenamiento local para gestionar los datos del usuario.

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
Para almacenamiento de datos más complejos y estructurados:

```javascript
// Guardar datos en un archivo JSON
await FileSystem.writeAsStringAsync(
  FileSystem.documentDirectory + 'data/entrenamientos.json',
  JSON.stringify(data)
);

// Leer datos desde un archivo JSON
const fileContent = await FileSystem.readAsStringAsync(
  FileSystem.documentDirectory + 'data/entrenamientos.json'
);
const data = JSON.parse(fileContent);
```

Datos almacenados con FileSystem:
- Historial de entrenamientos
- Metas mensuales
- Configuraciones avanzadas

## Pantallas de la Aplicación

### Bienvenida
Pantalla de inicio que muestra el nombre de la aplicación y permite al usuario continuar.

### Registro
Pantalla para recopilar la información básica del usuario:
- Nombre del corredor
- Datos personales relevantes

### Principal
Pantalla central de la aplicación con las siguientes funcionalidades:
- Resumen de actividad
- Progreso de meta mensual
- Botones de navegación a otras pantallas
- Registro rápido de entrenamientos nuevos

### Metas
Pantalla para gestionar metas de entrenamiento con las siguientes características:
- Establecer una nueva meta mensual de distancia
- Ver metas actuales y su progreso
- Actualizar metas existentes del mes actual
- Visualización automática de metas en cambios de mes
- Prevención de metas duplicadas por mes

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
  tipoEntrenamiento: string;  // Tipo de entrenamiento aplicable
}
```

### Proceso de Gestión de Metas

El sistema de metas funciona de la siguiente manera:

1. **Creación**: El usuario establece una distancia objetivo para un período de 30 días
2. **Almacenamiento**: La meta se guarda en `data/metas.json` con un ID único
3. **Seguimiento**: En la pantalla Principal y Metas se muestra el progreso actual
4. **Actualización Mensual Automática**: El sistema detecta cuando comienza un nuevo mes y crea automáticamente una nueva meta basada en la meta del mes anterior
5. **Actualización de Metas Existentes**: Si el usuario cambia una meta para el mes actual, se actualiza la meta existente en lugar de crear una duplicada
6. **Cálculo de Progreso**:
   - Se obtienen todos los entrenamientos del mes actual
   - Se suma la distancia total recorrida
   - Se calcula el porcentaje de cumplimiento respecto al objetivo

```javascript
// Verificación y creación automática de metas mensuales
const verificarMetaMensual = async () => {
  try {
    const metasCargadas = await cargarMetas();
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const añoActual = fechaActual.getFullYear();
    
    // Verificar si ya existe una meta para el mes actual
    const existeMetaMesActual = metasCargadas.some((meta) => {
      const partes = meta.fechaInicio.split('-');
      const metaFecha = new Date(
        parseInt(partes[2]), // año
        parseInt(partes[1]) - 1, // mes (0-11)
        parseInt(partes[0]) // día
      );
      return metaFecha.getMonth() === mesActual && 
             metaFecha.getFullYear() === añoActual;
    });
    
    if (!existeMetaMesActual) {
      // Buscar y usar la meta del mes anterior para crear la nueva meta
      const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
      const añoMesAnterior = mesActual === 0 ? añoActual - 1 : añoActual;
      
      let metaAnterior = metasCargadas.find((meta) => {
        const partes = meta.fechaInicio.split('-');
        const metaFecha = new Date(
          parseInt(partes[2]), 
          parseInt(partes[1]) - 1, 
          parseInt(partes[0])
        );
        
        return metaFecha.getMonth() === mesAnterior && 
               metaFecha.getFullYear() === añoMesAnterior;
      });
      
      if (metaAnterior) {
        // Crear una nueva meta basada en la del mes anterior
        await crearNuevaMetaMensual(metaAnterior.distanciaObjetivo);
      }
    }
  } catch (error) {
    console.error('Error al verificar meta mensual:', error);
  }
};
```

## Gestión de Metas por Mes

La aplicación implementa un sistema inteligente de metas mensuales con las siguientes capacidades:

### Actualización Automática de Metas

Al iniciar un nuevo mes, la aplicación:
1. Detecta automáticamente el cambio de mes
2. Verifica si existe una meta para el mes actual
3. Si no existe, busca la meta del mes anterior
4. Crea una nueva meta basada en la anterior
5. Notifica al usuario de la creación automática

```javascript
// Al cargar la pantalla de metas
useEffect(() => {
  obtenerNombre();
  obtenerMetaMensual();
  cargarMetas().then(() => {
    // Verificar si necesitamos crear una meta para el nuevo mes
    verificarMetaMensual();
  });
}, []);
```

### Prevención de Metas Duplicadas

Cuando el usuario actualiza su meta mensual:
1. El sistema busca si ya existe una meta para el mes actual
2. Si existe, actualiza los valores de la meta existente en lugar de crear una nueva
3. Si no existe, crea una nueva meta para el mes

```javascript
// Buscar si ya existe una meta para el mes actual
const metaIndex = metas.findIndex((meta) => {
  const partes = meta.fechaInicio.split('-');
  const metaFecha = new Date(
    parseInt(partes[2]), // año
    parseInt(partes[1]) - 1, // mes (0-11)
    parseInt(partes[0]) // día
  );
  
  // Verificar si la meta es del mes actual
  return metaFecha.getMonth() === currentMonth && 
         metaFecha.getFullYear() === currentYear;
});

if (metaIndex !== -1) {
  // Actualizar la meta existente del mes actual
  metas[metaIndex].distanciaObjetivo = parseFloat(metaMensual);
} else {
  // Si no hay meta para este mes, crear una nueva
  // ...
}
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

- **Frases.json**: Contiene todas las frases motivacionales disponibles en la aplicación.
```json
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
    "name": "Peace & Progress",
    "slug": "Peace-Progress",
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
      "bundleIdentifier": "com.Peace-Progress"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android/res/mipmap-xxxhdpi/ic_launcher_foreground.png",
        "backgroundImage": "./assets/images/android/res/mipmap-xxxhdpi/ic_launcher_background.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.Peace-Progress"
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
   - El sistema previene la duplicación de metas para el mismo mes
   - Al iniciar un nuevo mes, se crea automáticamente una nueva meta

6. **Frases Motivacionales**:
   - El usuario puede generar frases motivacionales aleatorias
   - Las frases están predefinidas en el archivo JSON

## Conclusión

Peace & Progress es una aplicación completa para corredores que integra funcionalidades de registro, seguimiento y motivación. Su diseño modular y sistema de almacenamiento local permiten una experiencia fluida sin necesidad de conexión a internet constante. El sistema de temas claro/oscuro y las interfaces adaptativas garantizan una buena experiencia de usuario en diferentes condiciones de uso.

---

*Documentación actualizada para el proyecto Peace & Progress - Junio 2025*
