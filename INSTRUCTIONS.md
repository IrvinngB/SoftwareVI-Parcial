# Instrucciones para Ejecutar el Proyecto

Este proyecto está construido con **Expo** y **React Native**, utilizando **Expo Router** para la navegación. A continuación se detallan las instrucciones para ejecutar el proyecto en diferentes plataformas.

## Prerrequisitos

### Requisitos Generales
- **Node.js** (versión 18 o superior)
- **npm** o **yarn** como gestor de paquetes
- **Expo CLI** instalado globalmente

### Para Android
- **Android Studio** con SDK de Android configurado
- **Java Development Kit (JDK)** 11 o superior
- Un dispositivo Android físico o un emulador de Android configurado

### Para Web
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

## Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd d:\ProyectosP\Tercero\Parcial2
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```
   o si prefieres yarn:
   ```bash
   yarn install
   ```

3. **Instalar Expo CLI globalmente** (si no lo tienes instalado)
   ```bash
   npm install -g @expo/cli
   ```

## Ejecutar el Proyecto

### 🌐 Ejecutar en Web

1. **Comando para iniciar en web:**
   ```bash
   npm run web
   ```
   o
   ```bash
   expo start --web
   ```

2. **El proyecto se abrirá automáticamente** en tu navegador predeterminado en `http://localhost:8081`

3. **Si no se abre automáticamente**, puedes abrir manualmente la URL que aparece en la terminal

### 📱 Ejecutar en Android

#### Opción 1: Usando un Dispositivo Físico

1. **Habilitar el modo desarrollador** en tu dispositivo Android:
   - Ve a Configuración > Acerca del teléfono
   - Toca 7 veces en "Número de compilación"
   - Regresa a Configuración > Opciones de desarrollador
   - Activa "Depuración USB"

2. **Conectar el dispositivo** via USB a tu computadora

3. **Instalar la app Expo Go** desde Google Play Store

4. **Ejecutar el comando:**
   ```bash
   npm run android
   ```
   o
   ```bash
   expo start --android
   ```

5. **Escanear el código QR** que aparece en la terminal con la app Expo Go

#### Opción 2: Usando un Emulador de Android

1. **Abrir Android Studio** y configurar un emulador:
   - Tools > AVD Manager
   - Create Virtual Device
   - Seleccionar un dispositivo y una versión de Android
   - Iniciar el emulador

2. **Verificar que el emulador esté funcionando:**
   ```bash
   adb devices
   ```

3. **Ejecutar el comando:**
   ```bash
   npm run android
   ```

### 🚀 Comando General de Inicio

Para iniciar el servidor de desarrollo y elegir la plataforma manualmente:

```bash
npm start
```
o
```bash
expo start
```

Esto abrirá el Expo DevTools donde podrás:
- Presionar `w` para abrir en web
- Presionar `a` para abrir en Android
- Escanear el código QR con Expo Go

## Scripts Disponibles

El proyecto incluye los siguientes scripts en `package.json`:

- `npm start` - Inicia el servidor de desarrollo de Expo
- `npm run web` - Inicia el proyecto específicamente para web
- `npm run android` - Inicia el proyecto específicamente para Android
- `npm run ios` - Inicia el proyecto para iOS (requiere macOS)
- `npm run lint` - Ejecuta ESLint para verificar el código
- `npm run reset-project` - Resetea el proyecto a su estado inicial

## Estructura del Proyecto

```
app/
├── _layout.tsx          # Layout principal de la aplicación
├── +not-found.tsx       # Página de error 404
└── (tabs)/             # Navegación por pestañas
    ├── _layout.tsx     # Layout de las pestañas
    ├── index.tsx       # Pestaña principal (Home)
    └── explore.tsx     # Pestaña de exploración

components/             # Componentes reutilizables
constants/             # Constantes (colores, etc.)
hooks/                # Custom hooks
assets/               # Imágenes, fuentes, etc.
```

## Solución de Problemas Comunes

### Problema: Error al instalar dependencias
**Solución:**
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Problema: El emulador de Android no se detecta
**Solución:**
1. Verificar que Android Studio esté instalado correctamente
2. Asegurarse de que las variables de entorno ANDROID_HOME estén configuradas
3. Reiniciar el emulador

### Problema: Error en la web relacionado con React Native Web
**Solución:**
- Asegúrate de que todas las dependencias estén actualizadas
- Limpia la caché: `expo start --clear`

### Problema: Puerto en uso
**Solución:**
```bash
npx kill-port 8081
npm start
```

## Información Adicional

- **Expo SDK Version:** ~53.0.9
- **React Native Version:** 0.79.2
- **TypeScript:** Habilitado (~5.8.3)
- **Navigation:** React Navigation con Expo Router

## Recursos Útiles

- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de React Native](https://reactnative.dev/)
- [Expo Router Documentation](https://expo.github.io/router/)

---

¡Disfruta desarrollando con Expo! 🚀
