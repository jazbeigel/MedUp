import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LoginForm from './Frontend/componentes/auth/LoginForm'
import Registro from './Frontend/componentes/auth/Registro'
import PacienteHomeScreen from './Frontend/componentes/pacientes/PacienteHomeScreen'
import DoctorHomeScreen from './Frontend/componentes/doctores/DoctorHomeScreen'
import InfoScreen from './Frontend/componentes/Home/InfoScreen'
import WelcomeScreen from './Frontend/componentes/Home/WelcomeScreen' 
import SolicitarTurno from './Frontend/componentes/Home/SolicitarTurno' 

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="Register" component={Registro} />
        <Stack.Screen name="PacienteHome" component={PacienteHomeScreen} />
        <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="SolicitarTurno" component={SolicitarTurno} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
