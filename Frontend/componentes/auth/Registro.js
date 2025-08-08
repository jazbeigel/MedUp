import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal
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
  const [tipoUsuario, setTipoUsuario] = useState('paciente')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Campos adicionales para profesionales
  const [matricula, setMatricula] = useState('')
  const [especialidad, setEspecialidad] = useState('')
  const [idEspecialidad, setIdEspecialidad] = useState('')
  const [especialidades, setEspecialidades] = useState([])
  const [showEspecialidadesModal, setShowEspecialidadesModal] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredEspecialidades, setFilteredEspecialidades] = useState([])

  useEffect(() => {
    loadEspecialidades()
  }, [])

  const loadEspecialidades = async () => {
    try {
      const { data, error } = await supabase
        .from('especialidades')
        .select('*')
        .order('nombre')
      
      if (error) {
        console.error('Error cargando especialidades:', error)
        return
      }
      
      setEspecialidades(data)
      setFilteredEspecialidades(data)
    } catch (error) {
      console.error('Error cargando especialidades:', error)
    }
  }

  const handleSearch = (text) => {
    setSearchText(text)
    if (text.trim() === '') {
      setFilteredEspecialidades(especialidades)
    } else {
      const filtered = especialidades.filter(esp =>
        esp.nombre.toLowerCase().includes(text.toLowerCase())
      )
      setFilteredEspecialidades(filtered)
    }
  }

  const handleRegister = async () => {
    setError(null)

    // Validaciones básicas
    if (!email || !password || !confirmPassword || !nombreCompleto || !telefono) {
      setError('Por favor, completá todos los campos obligatorios.')
      return
    }

    if (tipoUsuario === 'paciente' && (!fecha_nacimiento || !dni || !direccion)) {
      setError('Para pacientes, fecha de nacimiento, DNI y dirección son obligatorios.')
      return
    }

    if (tipoUsuario === 'profesional' && (!matricula || !especialidad || !idEspecialidad)) {
      setError('Para profesionales, matrícula y especialidad son obligatorios.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      // Primero crear el usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user) {
        // Preparar los datos del usuario según el tipo
        const userData = {
          id: authData.user.id,
          email,
          nombre_completo: nombreCompleto,
          telefono,
          ...(tipoUsuario === 'paciente' && {
            fecha_nacimiento,
            dni,
            direccion
          }),
          ...(tipoUsuario === 'profesional' && {
            matricula,
            especialidad,
            id_especialidad: idEspecialidad
          })
        }

        // Insertar en la tabla correspondiente
        const { data: insertData, error: insertError } = await supabase
          .from(tipoUsuario === 'paciente' ? 'pacientes' : 'profesionales')
          .insert([userData])
          .select()

        if (insertError) {
          setError(insertError.message)
          return
        }

        Alert.alert(
          '¡Registro Exitoso!',
          'Tu cuenta ha sido creada correctamente. Ya podés iniciar sesión.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Login')
            }
          ]
        )
      } else {
        setError('Error en el registro')
      }
    } catch (err) {
      console.error('Error en registro:', err)
      setError('Ocurrió un error inesperado. Intentalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const renderPacienteFields = () => (
    <>
      <TextInput
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        value={fecha_nacimiento}
        onChangeText={setFechaNacimiento}
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
    </>
  )

  const renderProfesionalFields = () => (
    <>
      <TextInput
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
        style={styles.input}
      />
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setShowEspecialidadesModal(true)}
      >
        <Text style={especialidad ? styles.selectorText : styles.placeholderText}>
          {especialidad || 'Seleccionar especialidad'}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
    </>
  )

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

        {/* Selector de tipo de usuario */}
        <View style={styles.tipoUsuarioContainer}>
          <TouchableOpacity
            style={[
              styles.tipoUsuarioButton,
              tipoUsuario === 'paciente' && styles.tipoUsuarioButtonActive
            ]}
            onPress={() => setTipoUsuario('paciente')}
          >
            <Text style={[
              styles.tipoUsuarioText,
              tipoUsuario === 'paciente' && styles.tipoUsuarioTextActive
            ]}>
              Paciente
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tipoUsuarioButton,
              tipoUsuario === 'profesional' && styles.tipoUsuarioButtonActive
            ]}
            onPress={() => setTipoUsuario('profesional')}
          >
            <Text style={[
              styles.tipoUsuarioText,
              tipoUsuario === 'profesional' && styles.tipoUsuarioTextActive
            ]}>
              Profesional
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Nombre completo"
          value={nombreCompleto}
          onChangeText={setNombreCompleto}
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

        {/* Campos específicos según tipo de usuario */}
        {tipoUsuario === 'paciente' ? renderPacienteFields() : renderProfesionalFields()}

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          onPress={handleRegister}
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Registrarse como {tipoUsuario}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>¿Ya tenés cuenta? Ingresá</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Welcome')}>
          <Text style={styles.link}>← Volver al inicio</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de especialidades */}
      <Modal
        visible={showEspecialidadesModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Especialidad</Text>
              <TouchableOpacity onPress={() => setShowEspecialidadesModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Buscar especialidad..."
                value={searchText}
                onChangeText={handleSearch}
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <ScrollView style={styles.modalList}>
              {filteredEspecialidades.length > 0 ? (
                filteredEspecialidades.map((esp) => (
                  <TouchableOpacity
                    key={esp.id}
                    style={styles.especialidadItem}
                    onPress={() => {
                      setEspecialidad(esp.nombre)
                      setIdEspecialidad(esp.id)
                      setSearchText('')
                      setShowEspecialidadesModal(false)
                    }}
                  >
                    <Text style={styles.especialidadText}>{esp.nombre}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    No se encontraron especialidades que coincidan con "{searchText}"
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  tipoUsuarioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  tipoUsuarioButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  },
  tipoUsuarioButtonActive: {
    backgroundColor: '#1A1A6E'
  },
  tipoUsuarioText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666'
  },
  tipoUsuarioTextActive: {
    color: '#fff'
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16
  },
  selector: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  selectorText: {
    fontSize: 16,
    color: '#333'
  },
  placeholderText: {
    fontSize: 16,
    color: '#999'
  },
  arrow: {
    fontSize: 12,
    color: '#666'
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
    marginTop: 10,
    textAlign: 'center'
  },
  link: {
    color: '#1A1A6E',
    marginTop: 15,
    textDecorationLine: 'underline'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A6E'
  },
  closeButton: {
    fontSize: 20,
    color: '#666'
  },
  modalList: {
    padding: 20
  },
  especialidadItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  especialidadText: {
    fontSize: 16,
    color: '#1A1A6E'
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center'
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  }
})
