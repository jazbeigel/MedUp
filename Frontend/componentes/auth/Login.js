import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Image
      source={require('../../assets/logo.png')}
      style={styles.logo}
  resizeMode="contain"
/>
      </View>

      <Text style={styles.welcome}>¡Hola! Bienvenido a{"\n"}<Text style={styles.bold}>MedUp</Text></Text>

      <Text style={styles.question}>
        ¿Cómo desea <Text style={styles.link}>iniciar sesión</Text>?
      </Text>

      <TouchableOpacity style={styles.buttonPaciente} onPress={() => navigation.navigate('LoginPaciente')}>
        <Text style={styles.buttonText}>Iniciar como Paciente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDoctor} onPress={() => navigation.navigate('LoginDoctor')}>
        <Text style={styles.buttonText}>Iniciar como Doctor</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Ayuda')}>
        <Text style={styles.help}>AYUDA</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  header: {
    width: '100%',
    height: 120,
    backgroundColor: '#212274',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 140,
    height: 80,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: '#1A1A6E',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bold: {
    textDecorationLine: 'underline',
  },
  question: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  link: {
    color: '#1A1A6E',
    textDecorationLine: 'underline',
  },
  buttonFarmacia: {
    width: '100%',
    height: 50,
    backgroundColor: '#8686A6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonPaciente: {
    width: '100%',
    height: 50,
    backgroundColor: '#5A568E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonDoctor: {
    width: '100%',
    height: 50,
    backgroundColor: '#1A1A6E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  help: {
    color: '#1A1A6E',
    fontSize: 14,
    marginTop: 25,
    textDecorationLine: 'underline',
  },
})
