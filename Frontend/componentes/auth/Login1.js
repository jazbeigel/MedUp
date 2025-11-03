import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function Login1({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresar a MedUp</Text>
      <Text style={styles.subtitle}>Seleccioná tu tipo de usuario</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#1A1A6E' }]}
        onPress={() => navigation.navigate('Login', { tipoUsuario: 'paciente' })}
      >
        <Text style={styles.buttonText}>Soy Paciente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4A90E2' }]}
        onPress={() => navigation.navigate('Login', { tipoUsuario: 'profesional' })}
      >
        <Text style={styles.buttonText}>Soy Médico</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.link}>← Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A6E',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center'
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500'
  },
  link: {
    color: '#1A1A6E',
    marginTop: 25,
    textDecorationLine: 'underline',
    fontWeight: '400'
  }
})