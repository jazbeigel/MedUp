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
  const [userType, setUserType] = useState('') // 'paciente' o 'doctor'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')

  // Campos paciente
  const [dni, setDni] = useState('')
  const [fecha_nacimiento, setFechaNacimiento] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')

  // Campos doctor
  const [matricula, setMatricula] = useState('')
  const [especialidad, setEspecialidad] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRegister = async () => {
    setError(null)

    if (!email || !password || !confirmPassword || !nombreCompleto) {
      setError('Por favor, completá todos los campos obligatorios.')
      return
    }

    if (userType === 'paciente' && (!dni || !fecha_nacimiento || !direccion || !telefono)) {
      setError('Por favor, completá todos los campos obligatorios para pacientes.')
      return
    }

    if (userType === 'doctor' && (!matricula || !especialidad)) {
      setError('Por favor, completá todos los campos obligatorios para doctores.')
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

      const table = userType === 'paciente' ? 'pacientes' : 'doctores'
      const insertData = userType === 'paciente'
        ? { usuario_id: userId, nombre_completo: nombreCompleto, dni, fecha_nacimiento, direccion, telefono }
        : { usuario_id: userId, nombre_completo: nombreCompleto, matricula, especialidad }

      const { error: insertError } = await supabase.from(table).insert([insertData])

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

  if (!userType) {
    return (
      <View style={styles.selectContainer}>
        <Text style={styles.title}>Registrarse como:</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setUserType('paciente')}>
          <Text style={styles.selectText}>Paciente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectButton} onPress={() => setUserType('doctor')}>
          <Text style={styles.selectText}>Doctor</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Welcome')}>
          <Text style={styles.link}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Flecha para volver a selección */}
        <TouchableOpacity onPress={() => setUserType('')} style={styles.backButton}>
          <Text style={styles.backText}>← Cambiar usuario</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Registro - {userType === 'paciente' ? 'Paciente' : 'Doctor'}</Text>

        <TextInput
          placeholder="Nombre completo"
          value={nombreCompleto}
          onChangeText={setNombreCompleto}
          style={styles.input}
        />

        {userType === 'paciente' && (
          <>
            <TextInput placeholder="DNI" value={dni} onChangeText={setDni} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Fecha de nacimiento" value={fecha_nacimiento} onChangeText={setFechaNacimiento} style={styles.input} />
            <TextInput placeholder="Dirección" value={direccion} onChangeText={setDireccion} style={styles.input} />
            <TextInput placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" style={styles.input} />
          </>
        )}

        {userType === 'doctor' && (
          <>
            <TextInput placeholder="Matrícula" value={matricula} onChangeText={setMatricula} style={styles.input} />
            <TextInput placeholder="Especialidad" value={especialidad} onChangeText={setEspecialidad} style={styles.input} />
          </>
        )}

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
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  selectContainer: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#F5F7FF',
    padding:20
  },
  selectButton: {
    width:'80%',
    padding:15,
    backgroundColor:'#1A1A6E',
    borderRadius:12,
    marginVertical:10,
    alignItems:'center'
  },
  selectText: {
    color:'#fff',
    fontSize:18,
    fontWeight:'500'
  },
  container: {
    padding:20,
    alignItems:'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: {
    color: '#1A1A6E',
    fontSize: 16,
    textDecorationLine: 'underline'
  },
  title: {
    fontSize:24,
    marginBottom:20,
    fontWeight:'500',
    color:'#1A1A6E',
    textAlign:'center'
  },
  input: {
    width:'100%',
    height:50,
    borderColor:'#ccc',
    borderWidth:1,
    borderRadius:10,
    paddingHorizontal:15,
    marginVertical:8,
    fontSize:16,
    fontWeight:'400'
  },
  button: {
    width:'100%',
    height:50,
    backgroundColor:'#1A1A6E',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    marginTop:15
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
    textAlign:'center'
  }
})
