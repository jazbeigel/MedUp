import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  RefreshControl,
  Modal
} from 'react-native'
import { supabase } from '../../utils/supabaseClient'

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null)
  const [turnos, setTurnos] = useState([])
  const [profesionales, setProfesionales] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    getUserData()
    loadTurnos()
    loadProfesionales()
  }, [])

  const getUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Obtener datos del paciente
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

  const loadTurnos = async () => {
    try {
      if (!user) return
      
      const response = await fetch(`http://localhost:3000/turnos/paciente/${user.id}`)
      const data = await response.json()
      setTurnos(data)
    } catch (error) {
      console.error('Error cargando turnos:', error)
    }
  }

  const loadProfesionales = async () => {
    try {
      const response = await fetch('http://localhost:3000/profesionales')
      const data = await response.json()
      setProfesionales(data)
    } catch (error) {
      console.error('Error cargando profesionales:', error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([loadTurnos(), loadProfesionales()])
    setRefreshing(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigation.replace('Login')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const cancelarTurno = async (turnoId) => {
    Alert.alert(
      'Cancelar Turno',
      '¿Estás seguro de que querés cancelar este turno?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              const response = await fetch(`http://localhost:3000/turnos/${turnoId}`, {
                method: 'DELETE'
              })
              
              if (response.ok) {
                Alert.alert('Éxito', 'Turno cancelado exitosamente')
                loadTurnos()
              } else {
                Alert.alert('Error', 'No se pudo cancelar el turno')
              }
            } catch (error) {
              console.error('Error cancelando turno:', error)
              Alert.alert('Error', 'Ocurrió un error al cancelar el turno')
            }
          }
        }
      ]
    )
  }

  return (
<<<<<<< HEAD
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          ¡Hola {user?.nombre_completo || 'Usuario'}!
        </Text>
        <Text style={styles.subtitle}>Tu panel de paciente</Text>
      </View>
=======
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenidooooo a MedUp</Text>
      <Text style={styles.subtitle}>Tu app para gestión médica</Text>
>>>>>>> d2c95594930ab4e4d845cc4c7752e221fadfcf1b

      {/* Sección de Acciones Rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('SolicitarTurno', { profesionales })}
        >
          <Text style={styles.actionButtonText}>📅 Solicitar Turno</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowNotifications(true)}
        >
          <Text style={styles.actionButtonText}>🔔 Notificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.actionButtonText}>👤 Mi Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de Turnos Próximos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Turnos Próximos</Text>
        
        {turnos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tenés turnos programados</Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('SolicitarTurno', { profesionales })}
            >
              <Text style={styles.emptyStateButtonText}>Solicitar mi primer turno</Text>
            </TouchableOpacity>
          </View>
        ) : (
          turnos.map((turno) => (
            <View key={turno.id} style={styles.turnoCard}>
              <View style={styles.turnoHeader}>
                <Text style={styles.turnoDoctor}>
                  Dr. {turno.profesional.nombre_completo}
                </Text>
                <Text style={styles.turnoEspecialidad}>
                  {turno.profesional.especialidad}
                </Text>
              </View>
              
              <Text style={styles.turnoFecha}>
                {formatDate(turno.fecha)}
              </Text>
              
              <View style={styles.turnoActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => cancelarTurno(turno.id)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Modal de Notificaciones */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notificaciones</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.notificationsList}>
              {turnos.length > 0 ? (
                turnos.map((turno) => (
                  <View key={turno.id} style={styles.notificationItem}>
                    <Text style={styles.notificationTitle}>
                      Turno confirmado con Dr. {turno.profesional.nombre_completo}
                    </Text>
                    <Text style={styles.notificationText}>
                      {formatDate(turno.fecha)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noNotifications}>
                  No tenés notificaciones pendientes
                </Text>
              )}
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
    paddingTop: 40
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8
  },
  section: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A6E',
    marginBottom: 15
  },
  actionButton: {
    backgroundColor: '#1A1A6E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyState: {
    alignItems: 'center',
    padding: 20
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15
  },
  emptyStateButton: {
    backgroundColor: '#1A1A6E',
    padding: 10,
    borderRadius: 8
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  turnoCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1A1A6E'
  },
  turnoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  turnoDoctor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A6E'
  },
  turnoEspecialidad: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic'
  },
  turnoFecha: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10
  },
  turnoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 6
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
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
  notificationsList: {
    padding: 20
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A6E',
    marginBottom: 5
  },
  notificationText: {
    fontSize: 14,
    color: '#666'
  },
  noNotifications: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic'
  }
})
