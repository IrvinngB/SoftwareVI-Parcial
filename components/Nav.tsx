import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Nav() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  // Colores según el tema
  const activeColor = Colors.palette.slateBlue;
  const inactiveColor = colorScheme === 'dark' ? Colors.palette.lightSlate : Colors.palette.navy;
  
  // Navegación a una ruta
  const navigateTo = (route: string) => {
    if (route === 'Bienvenida') {
      router.push('/Bienvenida/Bienvenida');
    } else if (route === 'Registro') {
      router.push('/Registro/Registro');
    }else if (route === 'Principal'){
      router.push('/Principal/Principal');
    } else {
      // Por ahora, solo alertamos que la página no existe
      alert(`La página de ${route} aún no está implementada`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0)' }]}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigateTo('Bienvenida')}
      >
        <AntDesign name="home" size={24} color={activeColor} />
        <ThemedText style={styles.navText}>Bienvenida</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigateTo('Principal')}
      >
        <AntDesign name="dashboard" size={24} color={inactiveColor} />
        <ThemedText style={styles.navText}>Dashboard</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigateTo('Historial')}
      >
        <FontAwesome5 name="history" size={22} color={inactiveColor} />
        <ThemedText style={styles.navText}>Historial</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigateTo('Registro')}
      >
        <MaterialIcons name="note-add" size={24} color={inactiveColor} />
        <ThemedText style={styles.navText}>Registro</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigateTo('Metas')}
      >
        <FontAwesome5 name="flag-checkered" size={22} color={inactiveColor} />
        <ThemedText style={styles.navText}>Metas</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    // borderTopWidth: 1,
    // borderTopColor: Colors.palette.lightSlate,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
  }

});