import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_PORT = 3000;
const API_BASE_URL =
  Platform.OS === 'web'
    ? `http://${window.location.hostname}:${API_PORT}`
    : Platform.OS === 'android'
    ? `http://10.0.2.2:${API_PORT}`
    : `http://localhost:${API_PORT}`;

export default function AgendarTurno({ navigation, route }) {
  const paciente = route?.params?.paciente ?? null;
  const [nombre, setNombre] = useState('');
  const [mail, setMail] = useState('');
  const [sintomas, setSintomas] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [especialidadId, setEspecialidadId] = useState('');
  const [profesionalId, setProfesionalId] = useState('');
  const [especialidades, setEspecialidades] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (paciente) {
      setNombre(paciente.nombre_completo ?? '');
      setMail(paciente.email ?? '');
    }
  }, [paciente]);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/especialidades`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) throw new Error('Respuesta inválida');
        const data = await response.json();
        setEspecialidades(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener especialidades', error);
        setEspecialidades([]);
      }
    };

    const fetchProfesionales = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profesionales`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) throw new Error('Respuesta inválida');
        const data = await response.json();
        setProfesionales(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener profesionales', error);
        setProfesionales([]);
      }
    };

    fetchEspecialidades();
    fetchProfesionales();
  }, []);

  const profesionalesFiltrados = useMemo(() => {
    if (!especialidadId) return profesionales;
    return profesionales.filter(
      (prof) => String(prof.id_especialidad ?? '') === String(especialidadId)
    );
  }, [especialidadId, profesionales]);

  const especialidadSeleccionada =
    especialidades.find((esp) => String(esp.id) === String(especialidadId))?.nombre ?? null;

  const obtenerNombreEspecialidad = (id) => {
    if (!id) return null;
    const esp = especialidades.find((item) => String(item.id) === String(id));
    return esp?.nombre ?? null;
  };

  const tomarValores = async () => {
    if (!paciente?.id) {
      Alert.alert('Error', 'No encontramos los datos del paciente. Volvé a iniciar sesión.');
      return;
    }

    if (!sintomas || !fecha || !hora || !especialidadId || !profesionalId) {
      Alert.alert('Error', 'Completá todos los campos requeridos.');
      return;
    }

    setSending(true);
    try {
      console.log('sintomas: ' + sintomas);
      console.log(`${API_BASE_URL}/api/turnos`);
      const response = await fetch(`${API_BASE_URL}/api/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente_id: paciente.id,
          profesional_id: Number(profesionalId),
          fecha: `${fecha}T${hora}`,
          descripcion: sintomas,
          estado: 'pendiente',
          especialidad_id: Number(especialidadId),
        }),
      });

      const contentType = response.headers.get('content-type') ?? '';
      const payload = contentType.includes('application/json') ? await response.json() : null;

      if (!response.ok) {
        const errorMessage = payload?.error ?? 'No pudimos registrar tu solicitud.';
        throw new Error(errorMessage);
      }

      Alert.alert('Éxito', 'Solicitud enviada correctamente. En breve el profesional la verá en su panel.');
      navigation?.goBack?.();
    } catch (error) {
      console.error('Error al crear solicitud de turno', error);
      Alert.alert('Error', error?.message ?? 'Ocurrió un error al enviar la solicitud.');
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Solicitá un turno</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
          editable={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={mail}
          onChangeText={setMail}
          editable={false}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Fecha (YYYY-MM-DD)"
          value={fecha}
          onChangeText={setFecha}
        />

        <TextInput
          style={styles.input}
          placeholder="Hora (HH:MM)"
          value={hora}
          onChangeText={setHora}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={especialidadId}
            onValueChange={(value) => {
              setEspecialidadId(value);
              setProfesionalId('');
            }}
            style={styles.picker}
          >
            <Picker.Item label="Seleccioná una especialidad" value="" />
            {especialidades.map((esp) => (
              <Picker.Item key={esp.id} label={esp.nombre} value={String(esp.id)} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={profesionalId}
            onValueChange={setProfesionalId}
            style={styles.picker}
          >
            <Picker.Item label="Seleccioná un profesional" value="" />
            {profesionalesFiltrados.map((prof) => {
              const espName = obtenerNombreEspecialidad(prof.id_especialidad);
              return (
                <Picker.Item
                  key={prof.id}
                  label={`${prof.nombre_completo}${espName ? ` - ${espName}` : ''}`}
                  value={String(prof.id)}
                />
              );
            })}
          </Picker>
        </View>

        <TextInput
          style={styles.textarea}
          placeholder="Describí tus síntomas o motivo de la consulta"
          value={sintomas}
          onChangeText={setSintomas}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.button, sending && styles.buttonDisabled]}
          onPress={tomarValores}
          disabled={sending}
        >
          <Text style={styles.buttonText}>
            {sending ? 'Enviando...' : 'Enviar solicitud'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation?.goBack?.()}
        >
          <Text style={styles.buttonSecondaryText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    color: '#1A1A6E',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6daf2',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f8f9ff',
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d6daf2',
    borderRadius: 10,
    backgroundColor: '#f8f9ff',
    marginBottom: 12,
  },
  picker: {
    height: 50,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#d6daf2',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f8f9ff',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1A1A6E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A6E',
  },
  buttonSecondaryText: {
    color: '#1A1A6E',
    fontSize: 15,
    fontWeight: '600',
  },
});
