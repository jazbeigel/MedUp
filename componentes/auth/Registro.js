import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { supabase } from '../../utils/supabaseClient'

export default function Register({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setError(null)
      alert('Registro exitoso, revisa tu email para confirmar tu cuenta')
      navigation.replace('Login')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro en MedUp</Text>

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

      <TextInput
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity onPress={handleRegister} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tenés cuenta? Ingresá</Text>
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
