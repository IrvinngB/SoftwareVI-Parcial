import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#000000' : '#ffffff';
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
        initialRouteName="index"
        screenOptions={{
          // Precarga la siguiente pantalla para transiciones más suaves
          presentation: 'card',
          // Animación más fluida para ir adelante
          animation: 'slide_from_right',
          // Permite gestos para navegar entre pantallas
          gestureEnabled: true,
          // Duración de la animación (ms)
          animationDuration: 200,
          // Color de fondo consistente para todas las transiciones
          contentStyle: { backgroundColor },
          // Configuración para la navegación gestual
          gestureDirection: 'horizontal',
          // Ajusta las opciones para una transición más suave
          headerShown: false,
          // Habilita gestos de pantalla completa
          fullScreenGestureEnabled: true,
          // Puedes ajustar la transición de regreso con el siguiente valor
          animationTypeForReplace: 'push',
        }}
        screenListeners={{
          // Observamos eventos de navegación
          beforeRemove: (e) => {
            if (e.data.action.type === 'GO_BACK') {
              // Podría usar lógica adicional aquí si fuera necesario
            }
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Bienvenido', headerShown: false }} />
        <Stack.Screen name="Bienvenida/Bienvenida" options={{ title: 'Bienvenido', headerShown: false }} />
        <Stack.Screen name="Registro/Registro" options={{ title: 'Registro', headerShown: false }} />
        <Stack.Screen name="Principal/Principal" options={{ title: 'Principal', headerShown: false }} />
        <Stack.Screen name="Frases/Frases" options={{ title: 'Frases', headerShown: false }} />
        <Stack.Screen name="Historial/Historial" options={{ title: 'Historial', headerShown: false }} />
        <Stack.Screen name="Metas/Metas" options={{ title: 'Metas', headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar />
    </ThemeProvider>
  );
}