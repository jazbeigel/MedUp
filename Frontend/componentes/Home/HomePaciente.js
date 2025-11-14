import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { supabase } from '../../utils/supabaseClient';

export default function HomePaciente({ navigation }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png' }}
            style={styles.headerImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Bienvenido paciente</Text>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Info')}>
              <Text style={styles.headerButtonText}>Más información</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* BODY */}
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Mis próximos turnos</Text>

        <View style={styles.turnosContainer}>
          <View style={styles.turnoCard}>
            <Text style={styles.turnoName}>Dr. Perez - Cardiología</Text>
            <Text style={styles.turnoFecha}>09 Jul - 12:00</Text>
          </View>

          <View style={styles.turnoCard}>
            <Text style={styles.turnoName}>Dra. Rojas - Medicina Interna</Text>
            <Text style={styles.turnoFecha}>20 Oct - 15:00</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('AgendarTurno')}>
              <Text style={styles.headerButtonText}>¡Saca tu proximo turno!</Text>
            </TouchableOpacity>



      </ScrollView>

      {/* FOOTER */}
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
  turnoFecha: { color: '#777', marginTop: 4 },

  calendarButton: { backgroundColor: '#1A1A6E', borderRadius: 30, alignItems: 'center', paddingVertical: 12, marginTop: 15 },
  calendarText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  // FOOTER
  footer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, backgroundColor: '#1A1A6E', borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  footerBtn: { backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 25, borderRadius: 25 },
  footerBtnText: { color: '#1A1A6E', fontWeight: '600' },
});
