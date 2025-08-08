import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PacienteHomeScreen from '../componentes/pacientes/PacienteHomeScreen'
import DoctorHomeScreen from '../componentes/doctores/DoctorHomeScreen'
import SolicitarTurno from '../componentes/Home/SolicitarTurno'
import InfoScreen from '../componentes/Home/InfoScreen'

const Stack = createNativeStackNavigator()

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PacienteHome" component={PacienteHomeScreen} />
      <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} />
      <Stack.Screen name="SolicitarTurno" component={SolicitarTurno} />
      <Stack.Screen name="Info" component={InfoScreen} />
    </Stack.Navigator>
  )
}
