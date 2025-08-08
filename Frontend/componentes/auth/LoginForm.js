import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { supabase } from '../../utils/supabaseClient'

export default function LoginForm({ navigation, tipoUsuario }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completá todos los campos')
      return
    }

    setLoading(true)

    try {
      // Autenticar con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        Alert.alert('Error', error.message)
        return
      }

      if (data.user) {
        // Verificar el tipo de usuario en la base de datos
        const { data: userData, error: userError } = await supabase
          .from(tipoUsuario === 'paciente' ? 'pacientes' : 'profesionales')
          .select('*')
          .eq('email', email)
          .single()

        if (userError || !userData) {
          Alert.alert('Error', 'Usuario no encontrado o tipo incorrecto')
          return
        }

        Alert.alert(
          '¡Bienvenido!',
          `Inicio de sesión exitoso como ${tipoUsuario}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navegar a la home correspondiente
                if (tipoUsuario === 'paciente') {
                  navigation.replace('PacienteHome')
                } else {
                  navigation.replace('DoctorHome')
                }
              }
            }
          ]
        )
      }
    } catch (error) {
      console.error('Error en login:', error)
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>
          Iniciar sesión
        </Text>

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

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>¿No tenés cuenta? Registrate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1A1A6E'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  button: {
    backgroundColor: '#1A1A6E',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center'
  },
  linkText: {
    color: '#1A1A6E',
    fontSize: 16
  },
  backButton: {
    marginTop: 15,
    alignItems: 'center'
  },
  backButtonText: {
    color: '#666',
    fontSize: 14
  }
})
