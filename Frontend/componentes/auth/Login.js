import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { supabase } from '../../utils/supabaseClient'

export default function Login({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setError(null)
      navigation.replace('Home')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresar a MedUp</Text>

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

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Welcome')}>
      <Text style={styles.link}>← Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20, backgroundColor:'#fff' },
  title: { fontSize:24, marginBottom:20, fontWeight:'bold', color:'#1A1A6E' },
  input: { width:'100%', height:50, borderColor:'#ccc', borderWidth:1, borderRadius:10, paddingHorizontal:15, marginVertical:10 },
  button: { width:'100%', height:50, backgroundColor:'#1A1A6E', borderRadius:10, justifyContent:'center', alignItems:'center', marginTop:15 },
  buttonText: { color:'#fff', fontSize:18, fontWeight:'bold' },
  error: { color:'red', marginTop:10 },
  link: { color:'#1A1A6E', marginTop:15, textDecorationLine:'underline' }
})
