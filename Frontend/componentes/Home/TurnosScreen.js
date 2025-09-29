import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TURNOS_ENDPOINT } from '../../utils/apiConfig';

const ESTADO_LABELS = {
  P: 'Pendiente',
  C: 'Confirmado',
  R: 'Rechazado',
};

const ESTADO_COLORS = {
  P: '#F4A261',
  C: '#2A9D8F',
  R: '#E76F51',
};

const formatFecha = (fechaIso) => {
  if (!fechaIso) return 'Sin fecha';
  try {
    const fecha = new Date(fechaIso);
    const fechaLocal = fecha.toLocaleDateString();
    const horaLocal = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${fechaLocal} · ${horaLocal}`;
  } catch (error) {
    return fechaIso;
  }
};

const TurnosScreen = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  const fetchTurnos = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch(TURNOS_ENDPOINT);
      if (!response.ok) {
        throw new Error('No se pudieron obtener los turnos.');
      }
      const data = await response.json();
      setTurnos(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      console.error(fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTurnos();
  }, [fetchTurnos]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTurnos();
  }, [fetchTurnos]);

  const confirmTurno = useCallback(
    async (turnoId) => {
      setConfirmingId(turnoId);
      try {
        const response = await fetch(`${TURNOS_ENDPOINT}/${turnoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ estado: 'C' }),
        });

        const payload = await response.json();
        if (!response.ok || !payload?.ok) {
          throw new Error(payload?.message ?? 'No se pudo confirmar el turno.');
        }

        setTurnos((prev) =>
          prev.map((turno) => (turno.id === turnoId ? payload.turno : turno))
        );

        Alert.alert('Turno confirmado', 'El turno fue confirmado correctamente.');
      } catch (confirmError) {
        console.error(confirmError);
        Alert.alert('Error', confirmError.message);
      } finally {
        setConfirmingId(null);
      }
    },
    []
  );

  const contenido = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1A1A6E" />
          <Text style={styles.loadingText}>Cargando turnos...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={fetchTurnos}>
            <Text style={styles.secondaryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (turnos.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No hay turnos agendados</Text>
          <Text style={styles.emptySubtitle}>
            Cuando agendes nuevos turnos vas a poder verlos y confirmarlos desde aquí.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={turnos}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A1A6E" />
        }
        renderItem={({ item }) => {
          const estadoLabel = ESTADO_LABELS[item.estado] ?? 'Sin estado';
          const estadoColor = ESTADO_COLORS[item.estado] ?? '#1A1A6E';
          const estaConfirmado = item.estado === 'C';

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Turno #{item.id}</Text>
                <View style={[styles.badge, { backgroundColor: estadoColor }]}>
                  <Text style={styles.badgeText}>{estadoLabel}</Text>
                </View>
              </View>
              <Text style={styles.cardItem}>
                <Text style={styles.cardLabel}>Paciente: </Text>
                {item.paciente_id ?? 'Sin asignar'}
              </Text>
              <Text style={styles.cardItem}>
                <Text style={styles.cardLabel}>Profesional: </Text>
                {item.profesional_id ?? 'Sin asignar'}
              </Text>
              <Text style={styles.cardItem}>
                <Text style={styles.cardLabel}>Fecha: </Text>
                {formatFecha(item.fecha)}
              </Text>

              {!estaConfirmado && (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => confirmTurno(item.id)}
                  disabled={confirmingId === item.id}
                >
                  {confirmingId === item.id ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Confirmar turno</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    );
  }, [confirmTurno, confirmingId, error, loading, onRefresh, refreshing, turnos, fetchTurnos]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de turnos</Text>
        <Text style={styles.subtitle}>
          Revisá los turnos de tus pacientes y confirmalos cuando corresponda.
        </Text>
      </View>
      {contenido}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A6E',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#5F6B7D',
    lineHeight: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#1A1A6E',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#E76F51',
    textAlign: 'center',
    marginBottom: 16,
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1A1A6E',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A6E',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#5F6B7D',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A6E',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  cardItem: {
    fontSize: 15,
    color: '#3E4A59',
    marginBottom: 6,
  },
  cardLabel: {
    fontWeight: '700',
    color: '#1A1A6E',
  },
  confirmButton: {
    marginTop: 14,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#2A9D8F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default TurnosScreen;
