import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

import Login from './src/componentes/Login';
import Registro from './src/componentes/Registro';
import Home from './src/componentes/Home';
import JuegoTriviaPrecio from './src/componentes/Original';
import Perfil from './src/componentes/Perfil';
import Logout from './src/componentes/Logout';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navegación principal con pestañas (solo para usuarios autenticados)
function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Original" component={JuegoTriviaPrecio} />
      <Tab.Screen name="Perfil" component={Perfil} />
      <Tab.Screen name="Logout" component={Logout} />
    </Tab.Navigator>
  );
}

// Navegación de autenticación (usuarios no logueados)
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registro" component={Registro} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {usuario ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
