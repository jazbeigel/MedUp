import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeStackNavigator from './HomeStackNavigator'
import ProfileStackNavigator from './ProfileStackNavigator'

const Tab = createBottomTabNavigator()

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1A1A6E',
      }}
    >
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'Inicio' }} />
      <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  )
}
