import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'

export default function InfoScreen() {
  return (
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
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor:'#fff' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20, color:'#1A1A6E', textAlign:'center' },
  paragraph: { fontSize:16, marginBottom:15, color:'#333' }
})
