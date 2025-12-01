import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../utils/supabaseClient';

const API_PORT = 3000;
const API_BASE_URL =
  Platform.OS === 'web'
    ? `http://${window.location.hostname}:${API_PORT}`
    : Platform.OS === 'android'
    ? `http://10.0.2.2:${API_PORT}`
    : `http://localhost:${API_PORT}`;

const STATUS_LABELS = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  rechazado: 'Rechazado',
  cancelado: 'Cancelado',
};

const formatFechaHora = (value) => {
  if (!value) return 'Fecha a coordinar';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha a coordinar';
  const fecha = date.toLocaleDateString();
  const hora = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${fecha} - ${hora}`;
};

export default function HomeProfesional({ navigation, route }) {
  const [professional, setProfessional] = useState(route?.params?.user ?? null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    if (route?.params?.user) {
      setProfessional(route.params.user);
    }
  }, [route?.params?.user]);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [pacRes, espRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/pacientes`),
          fetch(`${API_BASE_URL}/api/especialidades`),
        ]);
        const pacData = pacRes.ok ? await pacRes.json().catch(() => []) : [];
        const espData = espRes.ok ? await espRes.json().catch(() => []) : [];
        setPacientes(Array.isArray(pacData) ? pacData : []);
        setEspecialidades(Array.isArray(espData) ? espData : []);
      } catch (err) {
        console.error('Error al cargar catálogos auxiliares del profesional:', err);
        setPacientes([]);
        setEspecialidades([]);
      }
    };

    fetchCatalogos();
  }, []);

  const pacientesMap = useMemo(() => {
    return (pacientes ?? []).reduce((acc, paciente) => {
      acc[paciente.id] = paciente.nombre_completo;
      return acc;
    }, {});
  }, [pacientes]);

  const especialidadesMap = useMemo(() => {
    return (especialidades ?? []).reduce((acc, esp) => {
      acc[esp.id] = esp.nombre;
      return acc;
    }, {});
  }, [especialidades]);

  const fetchSolicitudes = useCallback(async () => {
    if (!professional?.id) return;
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/turnos?profesionalId=${professional.id}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('No se pudieron obtener las solicitudes.');
      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) throw new Error('Respuesta inválida.');
      const data = await response.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener solicitudes para el profesional:', err);
      setError(err?.message ?? 'Error al cargar las solicitudes.');
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  }, [professional?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchSolicitudes();
    }, [fetchSolicitudes])
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  const handleEstado = async (solicitudId, estado) => {
    setProcessingId(solicitudId);
    setStatusMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/turnos/${solicitudId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: estado  }),
      });
      if (!response.ok) throw new Error('No se pudo actualizar el estado.');
      await fetchSolicitudes();
      setStatusMessage(
        estado === 'confirmado'
          ? 'Turno confirmado correctamente.'
          : 'Turno rechazado.'
      );
    } catch (err) {
      console.error('Error actualizando estado de solicitud:', err);
      setError(err?.message ?? 'Error al actualizar el estado.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png' }}
            style={styles.headerImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>
              {professional?.nombre_completo
                ? `Bienvenido Dr/a ${professional.nombre_completo}`
                : 'Conocé más sobre nuestra app'}
            </Text>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Info')}>
              <Text style={styles.headerButtonText}>Más información</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.sectionTitle}>Solicitudes de turnos</Text>

        {loading && <Text style={styles.helperText}>Cargando solicitudes...</Text>}
        {!loading && statusMessage && (
          <Text style={[styles.helperText, { color: '#1A1A6E' }]}>{statusMessage}</Text>
        )}
        {error && !loading && <Text style={[styles.helperText, { color: 'red' }]}>{error}</Text>}
        {!loading && !solicitudes.length && !error && (
          <Text style={styles.helperText}>Aún no tenés solicitudes nuevas.</Text>
        )}

        <View style={styles.turnosContainer}>
          {solicitudes.map((solicitud) => {
            const pacienteNombre =
              solicitud.paciente_nombre ??
              pacientesMap[solicitud.paciente_id] ??
              'Paciente sin nombre';

            const especialidadNombre =
              solicitud.especialidad_nombre ??
              especialidadesMap[solicitud.especialidad_id] ??
              'General';

            return (
              <View key={solicitud.id} style={styles.turnoCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.turnoName}>Paciente: {pacienteNombre}</Text>
                    <Text style={styles.turnoDetalle}>
                      Especialidad: {especialidadNombre}
                    </Text>
                    <Text style={styles.turnoDetalle}>
                      Fecha: {formatFechaHora(solicitud.fecha)}
                    </Text>
                    {solicitud.descripcion ? (
                      <Text style={styles.turnoDetalle}>Motivo: {solicitud.descripcion}</Text>
                    ) : null}
                  </View>
                  <View style={styles.estadoContainer}>
                    <Text style={styles.estadoLabel}>Estado</Text>
                    <View
                      style={[
                        styles.estadoPill,
                        solicitud.estado === 'confirmado' && styles.estadoOk,
                        solicitud.estado === 'rechazado' && styles.estadoDanger,
                      ]}
                    >
                      <Text style={styles.estadoText}>
                        {STATUS_LABELS[solicitud.estado?.toLowerCase?.()] ??
                          solicitud.estado ??
                          'Pendiente'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.turnoActions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.acceptBtn]}
                    onPress={() => handleEstado(solicitud.id, 'confirmado')}
                    disabled={processingId === solicitud.id}
                  >
                    <Text style={styles.actionText}>
                      {processingId === solicitud.id ? 'Procesando...' : 'Confirmar'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => handleEstado(solicitud.id, 'rechazado')}
                    disabled={processingId === solicitud.id}
                  >
                    <Text style={styles.actionText}>Rechazar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerBtn} onPress={handleLogout}>
          <Text style={styles.footerBtnText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  header: {
    backgroundColor: '#1A1A6E',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  headerButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  headerButtonText: { color: '#1A1A6E', fontWeight: 'bold', fontSize: 13 },
  body: { flex: 1, paddingHorizontal: 20, marginTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginVertical: 15 },
  helperText: { fontSize: 14, color: '#555', marginBottom: 10 },
  turnosContainer: { marginTop: 10 },
  turnoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  turnoName: { fontWeight: '600', color: '#333', fontSize: 16 },
  turnoDetalle: { color: '#555', marginTop: 4 },
  estadoContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  estadoLabel: { fontSize: 12, color: '#777', marginBottom: 4 },
  estadoPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#FFF5CC',
  },
  estadoOk: { backgroundColor: '#E3F8D2' },
  estadoDanger: { backgroundColor: '#FFE1E1' },
  estadoText: { fontSize: 12, fontWeight: '600', color: '#1A1A6E' },
  turnoActions: { flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  acceptBtn: { backgroundColor: '#1A1A6E' },
  rejectBtn: { backgroundColor: '#FF6161' },
  actionText: { color: '#fff', fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#1A1A6E',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  footerBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  footerBtnText: { color: '#1A1A6E', fontWeight: '600' },
});
