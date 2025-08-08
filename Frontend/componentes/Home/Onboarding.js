import React from 'react'
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'
import { useNavigation } from '@react-navigation/native'

const WelcomeScreen = () => {
  const navigation = useNavigation()


  const handleDone = () => {
    navigation.replace('HomeScreen')
  }

  return (
    <Onboarding
      onDone={handleDone}
      pages={[
        {
          backgroundColor: '#fff',
          image: <Image source={require('./path-to-your-image1.png')} />, 
          title: 'Bienvenido a MedUp',
          subtitle: 'Gestiona tus citas médicas fácilmente.',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('./path-to-your-image2.png')} />, 
          title: 'Registro de Datos',
          subtitle: 'Ingresa tus datos personales y médicos.',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('./path-to-your-image3.png')} />, 
          title: 'Agenda tu Cita',
          subtitle: 'Selecciona el profesional y agenda tu cita.',
        },
        {
          backgroundColor: '#fff',
          image: (
            <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.title}>Información de MedUp</Text>

              <Text style={styles.paragraph}>
                MedUp es una aplicación diseñada para facilitar la gestión de tus citas médicas y la comunicación con profesionales de la salud.
              </Text>

              <Text style={styles.paragraph}>
                Podés registrar tus datos, agendar citas, y recibir notificaciones importantes.
              </Text>

              <Text style={styles.paragraph}>
                Nuestro objetivo es simplificar y mejorar la experiencia del paciente y del profesional médico.
              </Text>
            </ScrollView>
          ),
          title: 'Acerca de MedUp',
          subtitle: 'Una solución integral para tus citas médicas.',
        },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
    marginVertical: 10,
  },
})

export default WelcomeScreen
