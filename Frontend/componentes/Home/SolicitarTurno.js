import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native'
import { supabase } from '../../utils/supabaseClient'

export default function SolicitarTurno({ navigation, route }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [showTimeModal, setShowTimeModal] = useState(false)
  const [user, setUser] = useState(null)
  
  const profesionales = route.params?.profesionales || []
  
  const horariosDisponibles = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ]

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: paciente } = await supabase
          .from('pacientes')
          .select('*')
          .eq('usuario_id', user.id)
          .single()
        
        setUser(paciente)
      }
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !ubicacion) {
      Alert.alert('Error', 'Por favor completá todos los campos')
      return
    }

    setLoading(true)

    try {
      const fechaHora = new Date(`${selectedDate}T${selectedTime}`)
      
      const { data, error } = await supabase
        .from('turnos')
        .insert([{
          paciente_id: user.id,
          profesional_id: selectedDoctor.id,
          fecha_hora: fechaHora.toISOString(),
          ubicacion: ubicacion,
          estado: 'pendiente'
        }])
        .select()

      if (error) {
        Alert.alert('Error', error.message || 'No se pudo crear el turno')
        return
      }

      Alert.alert(
        '¡Turno Confirmado!',
        `Tu turno con Dr. ${selectedDoctor.nombre_completo} ha sido confirmado para el ${selectedDate} a las ${selectedTime}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      )
    } catch (error) {
      console.error('Error creando turno:', error)
      Alert.alert('Error', 'Ocurrió un error al crear el turno')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Solicitar Turno</Text>
      </View>

      <View style={styles.form}>
        {/* Selección de Doctor */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Seleccionar Doctor</Text>
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowDoctorModal(true)}
          >
            <Text style={selectedDoctor ? styles.selectorText : styles.placeholderText}>
              {selectedDoctor ? `${selectedDoctor.nombre_completo} - ${selectedDoctor.especialidad}` : 'Seleccionar doctor'}
            </Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Fecha */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha</Text>
          <TextInput
            style={styles.input}
            value={selectedDate}
            onChangeText={setSelectedDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
          />
        </View>

        {/* Hora */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hora</Text>
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowTimeModal(true)}
          >
            <Text style={selectedTime ? styles.selectorText : styles.placeholderText}>
              {selectedTime || 'Seleccionar hora'}
            </Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Ubicación */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ubicación</Text>
          <TextInput
            style={styles.input}
            value={ubicacion}
            onChangeText={setUbicacion}
            placeholder="Dirección del consultorio"
            placeholderTextColor="#999"
          />
        </View>

        {/* Información del turno */}
        {selectedDoctor && selectedDate && selectedTime && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Resumen del Turno</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Doctor:</Text>
              <Text style={styles.summaryValue}>Dr. {selectedDoctor.nombre_completo}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Especialidad:</Text>
              <Text style={styles.summaryValue}>{selectedDoctor.especialidad}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Fecha:</Text>
              <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Hora:</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
            </View>
          </View>
        )}

        {/* Botón de confirmar */}
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (!selectedDoctor || !selectedDate || !selectedTime || !ubicacion) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={loading || !selectedDoctor || !selectedDate || !selectedTime || !ubicacion}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Confirmar Turno</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal de selección de doctor */}
      <Modal
        visible={showDoctorModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Doctor</Text>
              <TouchableOpacity onPress={() => setShowDoctorModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalList}>
              {profesionales.map((doctor) => (
                <TouchableOpacity
                  key={doctor.id}
                  style={styles.doctorItem}
                  onPress={() => {
                    setSelectedDoctor(doctor)
                    setShowDoctorModal(false)
                  }}
                >
                  <View>
                    <Text style={styles.doctorName}>Dr. {doctor.nombre_completo}</Text>
                    <Text style={styles.doctorSpecialty}>{doctor.especialidad}</Text>
                    <Text style={styles.doctorMatricula}>Mat. {doctor.matricula}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de selección de hora */}
      <Modal
        visible={showTimeModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Hora</Text>
              <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalList}>
              {horariosDisponibles.map((hora) => (
                <TouchableOpacity
                  key={hora}
                  style={styles.timeItem}
                  onPress={() => {
                    setSelectedTime(hora)
                    setShowTimeModal(false)
                  }}
                >
                  <Text style={styles.timeText}>{hora}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#1A1A6E',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    marginRight: 15
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  form: {
    padding: 20
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A6E',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16
  },
  selector: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  summary: {
    backgroundColor: '#e8f4fd',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A6E',
    marginBottom: 15
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold'
  },
  summaryValue: {
    fontSize: 14,
    color: '#333'
  },
  submitButton: {
    backgroundColor: '#1A1A6E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
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
  doctorItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A6E',
    marginBottom: 4
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  doctorMatricula: {
    fontSize: 12,
    color: '#999'
  },
  timeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center'
  },
  timeText: {
    fontSize: 16,
    color: '#1A1A6E',
    fontWeight: 'bold'
  }
})