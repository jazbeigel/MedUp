const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase
const supabaseUrl = 'https://qhtjlctnsoajgouinjaq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodGpsY3Ruc29hamdvdWluamFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMzU2NjMsImV4cCI6MjA2NDYxMTY2M30.AVpXetLCSZLG_hg0W4wSJGVvXuwaIiwo983QZZAshI8'

const supabase = createClient(supabaseUrl, supabaseKey)

// Lista de especialidades básicas (sin IDs para evitar conflictos)
const especialidades = [
  'Cardiología',
  'Dermatología',
  'Endocrinología',
  'Gastroenterología',
  'Ginecología',
  'Hematología',
  'Infectología',
  'Medicina Interna',
  'Nefrología',
  'Neurología',
  'Oftalmología',
  'Oncología',
  'Ortopedia',
  'Otorrinolaringología',
  'Pediatría',
  'Psiquiatría',
  'Radiología',
  'Reumatología',
  'Traumatología',
  'Urología'
]

async function insertSpecialties() {
  try {
    console.log('🚀 Insertando especialidades...')
    
    // Insertar una por una para evitar conflictos
    for (let i = 0; i < especialidades.length; i++) {
      const especialidad = especialidades[i]
      
      console.log(`📝 Insertando: ${especialidad}`)
      
      const { data, error } = await supabase
        .from('especialidades')
        .insert([{ nombre: especialidad }])
        .select()
      
      if (error) {
        if (error.code === '23505') {
          console.log(`⚠️ ${especialidad} ya existe, saltando...`)
        } else {
          console.error(`❌ Error insertando ${especialidad}:`, error)
        }
      } else {
        console.log(`✅ ${especialidad} insertada correctamente`)
      }
      
      // Pequeña pausa para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('\n🎉 Proceso completado!')
    console.log('💡 Verificando especialidades...')
    
    // Verificar el resultado
    const { data: finalData, error: finalError } = await supabase
      .from('especialidades')
      .select('*')
      .order('nombre')
    
    if (finalError) {
      console.error('❌ Error verificando:', finalError)
      return
    }
    
    if (finalData && finalData.length > 0) {
      console.log(`✅ Total de especialidades en BD: ${finalData.length}`)
      console.log('📋 Lista de especialidades:')
      finalData.forEach((esp, index) => {
        console.log(`   ${index + 1}. ${esp.nombre}`)
      })
    } else {
      console.log('⚠️ No se encontraron especialidades')
    }
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

insertSpecialties()
