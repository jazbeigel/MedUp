import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { supabase } from '../../utils/supabaseClient'

export default function Register({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fecha_nacimiento, setFechaNacimiento] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [dni, setDni] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRegister = async () => {
    setError(null)

    // Validaciones básicas
    if (!email || !password || !confirmPassword || !fecha_nacimiento || !nombreCompleto || !dni || !telefono) {
      setError('Por favor, completá todos los campos obligatorios.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      const userId = data.user?.id
      if (!userId) {
        setError('No se pudo obtener el ID del usuario.')
        setLoading(false)
        return
      }

      const { error: insertError } = await supabase.from('pacientes').insert([
        {
          usuario_id: userId,
          nombre_completo: nombreCompleto,
          fecha_nacimiento,
          dni,
          direccion,
          telefono,
        },
      ])

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }

      alert('Registro exitoso. Revisá tu email para confirmar tu cuenta.')
      navigation.replace('Login')
    } catch (err) {
      setError('Ocurrió un error inesperado. Intentalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Registro en MedUp</Text>

        <TextInput
          placeholder="Nombre completo"
          value={nombreCompleto}
          onChangeText={setNombreCompleto}
          style={styles.input}
        />
        <TextInput
          placeholder="DNI"
          value={dni}
          onChangeText={setDni}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Dirección"
          value={direccion}
          onChangeText={setDireccion}
          style={styles.input}
        />
        <TextInput
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        <TextInput
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          style={styles.input}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          onPress={handleRegister}
          style={styles.button}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>¿Ya tenés cuenta? Ingresá</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Welcome')}>
          <Text style={styles.link}>← Volver al inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#1A1A6E',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1A1A6E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  error: {
    color: 'red',
    marginTop: 10
  },
  link: {
    color: '#1A1A6E',
    marginTop: 15,
    textDecorationLine: 'underline'
  }
})
