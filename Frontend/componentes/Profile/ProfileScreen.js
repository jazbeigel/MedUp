import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function ProfileScreen({ route }) {
  const { user, userType } = route.params || {}

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>No se pudo cargar el perfil</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.label}>Nombre:</Text>
      <Text style={styles.text}>{user.nombre_completo}</Text>
      {userType === 'paciente' ? (
        <>
          <Text style={styles.label}>DNI:</Text>
          <Text style={styles.text}>{user.dni}</Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>Matrícula:</Text>
          <Text style={styles.text}>{user.matricula}</Text>
        </>
      )}
      <Text style={styles.label}>Teléfono:</Text>
      <Text style={styles.text}>{user.telefono}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#fff' },
  title: { fontSize:28, fontWeight:'bold', color:'#1A1A6E', marginBottom:20 },
  label: { fontWeight:'bold', fontSize:16, marginTop:10 },
  text: { fontSize:16, color:'#333' },
  center: { flex:1, justifyContent:'center', alignItems:'center' }
})
