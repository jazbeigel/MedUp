import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native'

const API_PORT = 3000
const API_BASE_URL =
  Platform.OS === 'web'
    ? `http://${window.location.hostname}:${API_PORT}`
    : Platform.OS === 'android'
    ? `http://10.0.2.2:${API_PORT}`
    : `http://localhost:${API_PORT}`

export default function Login({ navigation, route }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const tipoUsuario = route?.params?.tipoUsuario || 'paciente'

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const endpoint = tipoUsuario === 'profesional' ? 'profesionales' : 'pacientes'
       
      const resp = await fetch(`${API_BASE_URL}/api/${endpoint}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await resp.json().catch(() => ({}))

      if (!resp.ok) {
        throw new Error(data?.error || 'Credenciales inválidas')
      }

      const user = data.user
      if (!user) throw new Error('Respuesta inválida del servidor')

      if (tipoUsuario === 'profesional') {
        navigation.replace('HomeProfesional', { user })
      } else {
        navigation.replace('HomePaciente', { user })
      }

    } catch (e) {
      console.error('Login error:', e)
      setError(e.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {tipoUsuario === 'profesional' ? 'Ingreso de Médicos' : 'Ingreso de Pacientes'}
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register', { tipoUsuario })}>
          <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Login1')}>
          <Text style={styles.link}>← Volver a selección de usuario</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff' },
  content: { width:'100%', paddingHorizontal:20, paddingVertical:30, marginTop:40 },
  title: { fontSize:24, marginBottom:15, fontWeight:'500', color:'#1A1A6E', textAlign:'center' },
  input: {
    width:'100%', height:50, borderColor:'#ccc', borderWidth:1, borderRadius:10,
    paddingHorizontal:15, marginVertical:8, fontWeight:'400', fontSize:16
  },
  button: {
    width:'100%', height:50, backgroundColor:'#1A1A6E', borderRadius:10,
    justifyContent:'center', alignItems:'center', marginTop:15
  },
  buttonText: { color:'#fff', fontSize:18, fontWeight:'500' },
  error: { color:'red', marginTop:10, textAlign:'center' },
  link: { color:'#1A1A6E', marginTop:15, textDecorationLine:'underline', fontWeight:'400', textAlign:'center' }
})
