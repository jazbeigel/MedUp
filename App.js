import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from './Frontend/componentes/auth/Login'
import Register from './Frontend/componentes/auth/Registro'
import HomeScreen from './Frontend/componentes/Home/HomeScreen'
import InfoScreen from './Frontend/componentes/Home/InfoScreen'
import ProfileScreen from './Frontend/componentes/Profile/ProfileScreen'
import WelcomeScreen from './Frontend/componentes/Home/WelcomeScreen'
import AgendarTurno from './Frontend/componentes/Home/AgendarTurno'
import TurnosScreen from './Frontend/componentes/Home/TurnosScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Agendar Turno" component={AgendarTurno}/>
        <Stack.Screen name="Turnos" component={TurnosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
