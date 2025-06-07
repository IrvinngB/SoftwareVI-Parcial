import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="Bienvenida/Bienvenida">
        <Stack.Screen name="Bienvenida/Bienvenida" options={{ title: 'Bienvenido', headerShown: false }} />
        <Stack.Screen name="Registro/Registro" options={{ title: 'Registro', headerShown: false }} />
        <Stack.Screen name="Principal/Principal" options={{ title: 'Principal', headerShown: false }} />
        <Stack.Screen name="Frases/Frases" options={{ title: 'Frases', headerShown: false }} />
        <Stack.Screen name="Historial/Historial" options={{ title: 'Historial', headerShown: false }} />
        <Stack.Screen name="Metas/Metas" options={{ title: 'Metas', headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}