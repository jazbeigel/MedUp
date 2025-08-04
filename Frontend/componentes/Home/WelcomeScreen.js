import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a MedUp</Text>
      <Text style={styles.subtitle}>Gestioná tu salud de manera fácil y segura</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20, backgroundColor:'#fff' },
  title: { fontSize:28, fontWeight:'bold', marginBottom:10, color:'#1A1A6E', textAlign:'center' },
  subtitle: { fontSize:16, marginBottom:30, color:'#555', textAlign:'center' },
  button: { width:'100%', height:50, backgroundColor:'#1A1A6E', borderRadius:10, justifyContent:'center', alignItems:'center', marginVertical:10 },
  buttonText: { color:'#fff', fontSize:18, fontWeight:'bold' }
})
