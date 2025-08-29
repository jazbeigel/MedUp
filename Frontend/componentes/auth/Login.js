import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'



export default function Login({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null) // no se siguen mostrando errores anteriores

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Error de conexión, intenta nuevamente')
      }

      navigation.replace('Home', { email })
    } catch (err) {
      setError(err.message || 'Error de conexión, intenta nuevamente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex:1, 
    justifyContent:'center', 
    alignItems:'center', 
    backgroundColor:'#fff' 
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 40, // baja todo el bloque un poco
  },
  title: { 
    fontSize:24, 
    marginBottom:15, 
    fontWeight:'500', 
    color:'#1A1A6E',
    textAlign: 'center'
  },
  input: { 
    width:'100%', 
    height:50, 
    borderColor:'#ccc', 
    borderWidth:1, 
    borderRadius:10, 
    paddingHorizontal:15, 
    marginVertical:8,
    fontWeight:'400', 
    fontSize:16,
  },
  button: { 
    width:'100%', 
    height:50, 
    backgroundColor:'#1A1A6E', 
    borderRadius:10, 
    justifyContent:'center', 
    alignItems:'center', 
    marginTop:15,
  },
  buttonText: { 
    color:'#fff', 
    fontSize:18, 
    fontWeight:'500'
  },
  error: { 
    color:'red', 
    marginTop:10,
    textAlign:'center'
  },
  link: { 
    color:'#1A1A6E', 
    marginTop:15, 
    textDecorationLine:'underline',
    fontWeight:'400',
    textAlign:'center'
  }
})
