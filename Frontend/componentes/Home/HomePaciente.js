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

const formatFechaHora = (value) => {
  if (!value) return 'Fecha a confirmar';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha a confirmar';
  const fecha = date.toLocaleDateString();
  const hora = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${fecha} - ${hora}`;
};

export default function HomePaciente({ navigation, route }) {
  const [patient, setPatient] = useState(route?.params?.user ?? null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profesionales, setProfesionales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    if (route?.params?.user) {
      setPatient(route.params.user);
    }
  }, [route?.params?.user]);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [profRes, espRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/profesionales`),
          fetch(`${API_BASE_URL}/api/especialidades`),
        ]);
        const profData = profRes.ok ? await profRes.json().catch(() => []) : [];
        const espData = espRes.ok ? await espRes.json().catch(() => []) : [];
        setProfesionales(Array.isArray(profData) ? profData : []);
        setEspecialidades(Array.isArray(espData) ? espData : []);
      } catch (catalogError) {
        console.error('Error al cargar catálogos:', catalogError);
        setProfesionales([]);
        setEspecialidades([]);
      }
    };

    fetchCatalogos();
  }, []);

  const profesionalesMap = useMemo(() => {
    return (profesionales ?? []).reduce((acc, prof) => {
      acc[prof.id] = {
        nombre: prof.nombre_completo,
        especialidadId: prof.id_especialidad,
      };
      return acc;
    }, {});
  }, [profesionales]);

  const especialidadesMap = useMemo(() => {
    return (especialidades ?? []).reduce((acc, esp) => {
      acc[esp.id] = esp.nombre;
      return acc;
    }, {});
  }, [especialidades]);

  const fetchSolicitudes = useCallback(async () => {
    if (!patient?.id) return;
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/turnos?pacienteId=${patient.id}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('No se pudieron obtener las solicitudes.');
      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) throw new Error('Respuesta inválida.');
      const data = await response.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener solicitudes de turnos:', err);
      setError(err?.message ?? 'Error al cargar tus solicitudes.');
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  }, [patient?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchSolicitudes();
    }, [fetchSolicitudes])
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  const handleRequestTurno = () => {
    if (!patient) return;
    navigation.navigate('AgendarTurno', { paciente: patient });
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
              {patient?.nombre_completo ? `Hola, ${patient.nombre_completo}` : 'Bienvenido paciente'}
            </Text>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Info')}>
              <Text style={styles.headerButtonText}>Más información</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Mis solicitudes de turno</Text>

        {loading && <Text style={styles.helperText}>Cargando solicitudes...</Text>}
        {error && !loading && <Text style={[styles.helperText, { color: 'red' }]}>{error}</Text>}

        {!loading && !solicitudes.length && !error && (
          <Text style={styles.helperText}>Aún no hiciste solicitudes.</Text>
        )}

        <View style={styles.turnosContainer}>
          {solicitudes.map((solicitud) => {
            const profesionalInfo = profesionalesMap[solicitud.profesional_id];
            const nombreProfesional =
              solicitud.profesional_nombre ?? profesionalInfo?.nombre ?? 'A confirmar';

            const especialidadNombre =
              solicitud.especialidad_nombre ??
              especialidadesMap[solicitud.especialidad_id] ??
              (profesionalInfo?.especialidadId
                ? especialidadesMap[profesionalInfo.especialidadId]
                : null) ??
              'General';

            return (
              <View key={solicitud.id} style={styles.turnoCard}>
                <Text style={styles.turnoName}>Profesional: {nombreProfesional}</Text>
                <Text style={styles.turnoDetalle}>Especialidad: {especialidadNombre}</Text>
                <Text style={styles.turnoFecha}>{formatFechaHora(solicitud.fecha)}</Text>
                {solicitud.descripcion ? (
                  <Text style={styles.turnoSintomas}>Motivo: {solicitud.descripcion}</Text>
                ) : null}
                <View style={styles.estadoBadge}>
                  <Text style={styles.estadoText}>
                    {(solicitud.estado ?? 'pendiente').toUpperCase()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.headerButton} onPress={handleRequestTurno}>
          <Text style={styles.headerButtonText}>¡Sacá tu próximo turno!</Text>
        </TouchableOpacity>
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

  // HEADER
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
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  headerImage: { width: 70, height: 70, borderRadius: 35, marginRight: 15, backgroundColor: '#fff', borderWidth: 2, borderColor: '#fff' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 8 },
  headerButton: { backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 20, alignSelf: 'flex-start' },
  headerButtonText: { color: '#1A1A6E', fontWeight: 'bold', fontSize: 13 },

  // BODY
  body: { flex: 1, paddingHorizontal: 20, marginTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginVertical: 15 },
  helperText: { fontSize: 14, color: '#555', marginBottom: 10 },

  // TURNOS
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
  turnoName: { fontWeight: '600', color: '#333' },
  turnoDetalle: { color: '#555', marginTop: 4 },
  turnoFecha: { color: '#777', marginTop: 4 },
  turnoSintomas: { color: '#555', marginTop: 4 },
  estadoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6E9FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  estadoText: { color: '#1A1A6E', fontWeight: '700', fontSize: 12 },

  calendarButton: { backgroundColor: '#1A1A6E', borderRadius: 30, alignItems: 'center', paddingVertical: 12, marginTop: 15 },
  calendarText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  // FOOTER
  footer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, backgroundColor: '#1A1A6E', borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  footerBtn: { backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 25, borderRadius: 25 },
  footerBtnText: { color: '#1A1A6E', fontWeight: '600' },
});
