import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { supabase } from '../../utils/supabaseClient';

export default function HomeScreen({ navigation }) {
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
            <Text style={styles.headerTitle}>Conocé más sobre nuestra app</Text>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Info')}>
              <Text style={styles.headerButtonText}>Más información</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* BODY */}
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <Text style={styles.sectionTitle}>Mis pacientes</Text>

        <View style={styles.pacienteContainer}>
          <View style={styles.pacienteCard}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.pacienteFoto}
            />
            <Text style={styles.pacienteName}>Jose Perez</Text>
            <Text style={styles.pacienteEdad}>Edad: 40</Text>
            <TouchableOpacity style={styles.verMasBtn}>
              <Text style={styles.verMasText}>Ver más</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pacienteCard}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              style={styles.pacienteFoto}
            />
            <Text style={styles.pacienteName}>Maria Rojas</Text>
            <Text style={styles.pacienteEdad}>Edad: 36</Text>
            <TouchableOpacity style={styles.verMasBtn}>
              <Text style={styles.verMasText}>Ver más</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pacienteCard}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/56.jpg' }}
              style={styles.pacienteFoto}
            />
            <Text style={styles.pacienteName}>Jorge Lopez</Text>
            <Text style={styles.pacienteEdad}>Edad: 47</Text>
            <TouchableOpacity style={styles.verMasBtn}>
              <Text style={styles.verMasText}>Ver más</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Agregar paciente</Text>
        </TouchableOpacity>

        {/* Espacio adicional antes de turnos */}
        <View style={{ marginTop: 35 }}>
          <Text style={styles.sectionTitle}>Próximos turnos</Text>

          <View style={styles.turnosContainer}>
            <View style={styles.turnoCard}>
              <Text style={styles.turnoName}>Maria Rojas - Cardiología</Text>
              <Text style={styles.turnoFecha}>09 Jul - 12:00</Text>
            </View>

            <View style={styles.turnoCard}>
              <Text style={styles.turnoName}>Jose Perez - Medicina Interna</Text>
              <Text style={styles.turnoFecha}>20 Oct - 15:00</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.calendarButton}>
            <Text style={styles.calendarText}>Calendario</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.footerBtnText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.footerBtnText}>Perfil</Text>
        </TouchableOpacity>
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

  // BODY
  body: { flex: 1, paddingHorizontal: 20, marginTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginVertical: 15 },

  // PACIENTES
  pacienteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pacienteCard: {
    backgroundColor: '#fff',
    width: '30%',
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  pacienteFoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  pacienteName: { fontSize: 15, fontWeight: '600', color: '#333', textAlign: 'center' },
  pacienteEdad: { fontSize: 13, color: '#777', marginBottom: 10 },
  verMasBtn: {
    backgroundColor: '#1A1A6E',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    position: 'absolute',
    bottom: 10,
  },
  verMasText: { color: '#fff', fontSize: 12 },

  addButton: {
    marginTop: 15,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A6E',
  },
  addButtonText: { color: '#1A1A6E', fontWeight: '600' },

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

  calendarButton: {
    backgroundColor: '#1A1A6E',
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 15,
  },
  calendarText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  // FOOTER
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
