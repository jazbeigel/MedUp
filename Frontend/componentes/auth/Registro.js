import React, { useState, useEffect } from 'react'
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
import { Picker } from '@react-native-picker/picker'

// 🔧 URL flexible según la plataforma
const API_PORT = 3000
const API_BASE_URL =
  Platform.OS === 'web'
    ? `http://${window.location.hostname}:${API_PORT}`   // Web
    : Platform.OS === 'android'
    ? `http://10.0.2.2:${API_PORT}`                     // Emulador Android
    : `http://localhost:${API_PORT}`                    // iOS Simulator

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
  const [especialidadId, setEspecialidadId] = useState('')
  const [especialidades, setEspecialidades] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 🔹 Carga de especialidades
  useEffect(() => {
    if (userType === 'doctor') {
      const fetchEspecialidades = async () => {
        try {
          const url = `${API_BASE_URL}/api/especialidades`
          console.log('GET ESPECIALIDADES:', url)

          const response = await fetch(url)
          if (!response.ok) {
            const errorText = await response.text().catch(() => '')
            throw new Error(`HTTP ${response.status} - ${errorText}`)
          }

          const contentType = response.headers.get('content-type') ?? ''
          if (!contentType.includes('application/json')) {
            const errorText = await response.text().catch(() => '')
            throw new Error(`Respuesta no válida del servidor: ${errorText}`)
          }

          const data = await response.json()
          setEspecialidades(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error('Error al obtener especialidades', error)
          setEspecialidades([])
        }
      }

      fetchEspecialidades()
    }
  }, [userType])

  // 🔹 Registro de usuario
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

    if (userType === 'doctor' && (!matricula || !especialidadId || !telefono)) {
      setError('Por favor, completá todos los campos obligatorios para doctores.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      const selectedEspecialidad = especialidades.find(
        (esp) => String(esp.id) === String(especialidadId)
      )

      const userData =
        userType === 'paciente'
          ? {
              tipo: 'paciente',
              nombre_completo: nombreCompleto,
              email,
              password,
              dni,
              fecha_nacimiento,
              direccion,
              telefono,
            }
          : {
              tipo: 'profesional',
              nombre_completo: nombreCompleto,
              email,
              password,
              matricula,
              id_especialidad: especialidadId ? parseInt(especialidadId, 10) : null,
              telefono,
              // especialidad: selectedEspecialidad?.nombre ?? '' // opcional
            }

      const endpoint = userType === 'paciente' ? 'pacientes' : 'profesionales'
      const url = `${API_BASE_URL}/api/${endpoint}`

      console.log('POST registro:', url, userData)

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      const contentType = response.headers.get('content-type') ?? ''

      if (!response.ok) {
        let errorMessage = 'Error al registrar usuario'
        if (contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => null)
          if (errorData?.message) errorMessage = errorData.message
        } else {
          const errorText = await response.text().catch(() => '')
          if (errorText) errorMessage = `${errorMessage}: ${errorText}`
        }
        throw new Error(errorMessage)
      }

      if (!contentType.includes('application/json')) {
        throw new Error('Respuesta inesperada del servidor')
      }

      const result = await response.json()
      console.log('Usuario registrado:', result)

      alert('Registro exitoso')
      navigation.replace('Login')
    } catch (err) {
      console.error(err)
      setError(err?.message ?? 'Ocurrió un error al registrar. Intentalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Pantalla de selección inicial
  if (!userType) {
    return (
      <View style={styles.selectContainer}>
        <Text style={styles.title}>Registrarse como:</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setUserType('paciente')}>
          <Text style={styles.selectText}>Paciente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectButton} onPress={() => setUserType('doctor')}>
          <Text style={styles.selectText}>Profesional</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Welcome')}>
          <Text style={styles.link}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // 🔹 Formulario principal
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => setUserType('')} style={styles.backButton}>
          <Text style={styles.backText}>← Cambiar usuario</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Registro - {userType === 'paciente' ? 'Paciente' : 'Profesional'}</Text>

        <TextInput
          placeholder="Nombre completo"
          value={nombreCompleto}
          onChangeText={setNombreCompleto}
          style={styles.input}
        />

        {userType === 'paciente' && (
          <>
            <TextInput placeholder="DNI" value={dni} onChangeText={setDni} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Fecha de nacimiento (YYYY-MM-DD)" value={fecha_nacimiento} onChangeText={setFechaNacimiento} style={styles.input} />
            <TextInput placeholder="Dirección" value={direccion} onChangeText={setDireccion} style={styles.input} />
            <TextInput placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" style={styles.input} />
          </>
        )}

        {userType === 'doctor' && (
          <>
            <TextInput
              placeholder="Matrícula"
              value={matricula}
              onChangeText={setMatricula}
              style={styles.input}
            />
            <TextInput
              placeholder="Teléfono"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <Picker
              selectedValue={especialidadId || ''}
              onValueChange={(val) => setEspecialidadId(String(val))}
              style={styles.picker}
            >
              <Picker.Item label="Seleccioná una especialidad" value="" />
              {especialidades.map((esp) => (
                <Picker.Item key={esp.id} label={esp.nombre} value={String(esp.id)} />
              ))}
            </Picker>
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

// 🎨 Estilos
const styles = StyleSheet.create({
  selectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FF',
    padding: 20
  },
  selectButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#1A1A6E',
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center'
  },
  selectText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500'
  },
  container: {
    padding: 20,
    alignItems: 'center'
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10
  },
  backText: {
    color: '#1A1A6E',
    fontSize: 16,
    textDecorationLine: 'underline'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '500',
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
    marginVertical: 8,
    fontSize: 16,
    fontWeight: '400'
  },
  picker: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 8,
    justifyContent: 'center'
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
    fontWeight: '500'
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center'
  },
  link: {
    alignSelf: 'flex-start',
    color: '#1A1A6E',
    marginTop: 50,
    textDecorationLine: 'underline',
    textAlign: 'center'
  }
})
