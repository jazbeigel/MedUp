import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
export default function ProfileScreen({ route }) {
  const { email } = route.params || {}
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/auth/user?email=${encodeURIComponent(email)}`)
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error)
        }
        setUser(data.user)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [email])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A1A6E" />
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>No se pudo cargar el perfil</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.text}>{user.email}</Text>

      {/* Podés agregar más campos del perfil que tengas en Supabase */}

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#fff' },
  title: { fontSize:28, fontWeight:'bold', color:'#1A1A6E', marginBottom:20 },
  label: { fontWeight:'bold', fontSize:16, marginTop:10 },
  text: { fontSize:16, color:'#333' },
  center: { flex:1, justifyContent:'center', alignItems:'center' }
})
