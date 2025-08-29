import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { supabase } from '../../utils/supabaseClient'

export default function HomeScreen({ route, navigation }) {
  const { user, userType } = route.params || {}

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigation.replace('Login')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido {user?.nombre_completo || ''}</Text>
      <Text style={styles.subtitle}>Tu app para gestión médica</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Info')}>
        <Text style={styles.buttonText}>Información</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile', { user, userType })}>
        <Text style={styles.buttonText}>Mi Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#e74c3c' }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff', padding:20 },
  title: { fontSize:28, fontWeight:'bold', marginBottom:10, color:'#1A1A6E' },
  subtitle: { fontSize:16, marginBottom:30, color:'#555' },
  button: { width:'100%', height:50, backgroundColor:'#1A1A6E', borderRadius:10, justifyContent:'center', alignItems:'center', marginVertical:10 },
  buttonText: { color:'#fff', fontSize:18, fontWeight:'bold' }
})
