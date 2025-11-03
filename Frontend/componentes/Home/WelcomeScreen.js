import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Imagen tipo banner arriba */}
      <Image 
        source={require('../auth/fotoMed.png')} 
        style={styles.banner} 
        resizeMode="cover"
      />

      {/* Texto de bienvenida */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Bienvenido a MedUp</Text>
        <Text style={styles.subtitle}>Gestioná tu salud de manera fácil y segura</Text>
      </View>

      {/* Botones */}
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login1')}>
        <Text style={styles.loginButtonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 20,
    backgroundColor: '#F5F7FF',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: '30%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  textContainer: {
    marginTop: 25, // más cerca de la imagen
    marginBottom: 30, // menos espacio abajo → suben los botones
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600', // más finita → look formal
    marginBottom: 8,
    color: '#1A1A6E',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B4B7C',
    textAlign: 'center',
    fontWeight: '400', // más liviana
    lineHeight: 22,
  },
  loginButton: {
    width: '85%',
    height: 52,
    backgroundColor: '#1A1A6E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerButton: {
    width: '85%',
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: '#1A1A6E',
    shadowColor: '#1A1A6E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  registerButtonText: {
    color: '#1A1A6E',
    fontSize: 18,
    fontWeight: '600',
  },
})
