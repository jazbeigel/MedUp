const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase - REEMPLAZA CON TUS CREDENCIALES
const supabaseUrl = 'https://qhtjlctnsoajgouinjaq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodGpsY3Ruc29hamdvdWluamFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMzU2NjMsImV4cCI6MjA2NDYxMTY2M30.AVpXetLCSZLG_hg0W4wSJGVvXuwaIiwo983QZZAshI8'

const supabase = createClient(supabaseUrl, supabaseKey)

// Lista completa de especialidades médicas
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
  'Urología',
  'Alergología',
  'Anestesiología',
  'Cirugía General',
  'Cirugía Cardiovascular',
  'Cirugía Plástica',
  'Cirugía Torácica',
  'Cirugía Vascular',
  'Coloproctología',
  'Dermatología Estética',
  'Endocrinología Pediátrica',
  'Fertilidad y Reproducción',
  'Fisiatría',
  'Fonoaudiología',
  'Genética Médica',
  'Geriatría',
  'Hepatología',
  'Inmunología',
  'Medicina Deportiva',
  'Medicina Familiar',
  'Medicina Legal',
  'Medicina Nuclear',
  'Medicina Preventiva',
  'Medicina del Trabajo',
  'Neumonología',
  'Neurocirugía',
  'Nutrición',
  'Obstetricia',
  'Odontología',
  'Oftalmología Pediátrica',
  'Oncología Pediátrica',
  'Ortopedia y Traumatología',
  'Patología',
  'Psicología',
  'Psicopedagogía',
  'Terapia Ocupacional',
  'Toxicología',
  'Trasplantes',
  'Urgencias Médicas',
  'Vascular Periférico'
]

async function populateSpecialties() {
  try {
    console.log('🚀 Iniciando población de especialidades...')
    
    // Primero verificar si la tabla existe y su estructura
    console.log('📋 Verificando estructura de la tabla...')
    const { data: tableInfo, error: tableError } = await supabase
      .from('especialidades')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('❌ Error accediendo a la tabla especialidades:', tableError)
      console.log('💡 Posibles soluciones:')
      console.log('   1. Verificar que la tabla "especialidades" existe en Supabase')
      console.log('   2. Verificar que las políticas de seguridad permiten inserción')
      console.log('   3. Verificar las credenciales de Supabase')
      return
    }
    
    console.log('✅ Tabla especialidades encontrada')
    
    // Verificar si ya existen especialidades
    const { data: existingSpecialties, error: checkError } = await supabase
      .from('especialidades')
      .select('*')
    
    if (checkError) {
      console.error('❌ Error verificando especialidades existentes:', checkError)
      return
    }
    
    if (existingSpecialties && existingSpecialties.length > 0) {
      console.log('ℹ️ Ya existen especialidades en la base de datos')
      console.log(`📊 Total de especialidades existentes: ${existingSpecialties.length}`)
      return
    }
    
    // Preparar datos para inserción
    const specialtiesData = especialidades.map((nombre, index) => ({
      id: index + 1,
      nombre: nombre
    }))
    
    // Insertar especialidades
    const { data, error } = await supabase
      .from('especialidades')
      .insert(specialtiesData)
    
    if (error) {
      console.error('❌ Error insertando especialidades:', error)
      return
    }
    
    console.log(`✅ Se insertaron ${especialidades.length} especialidades exitosamente`)
    console.log('📋 Especialidades insertadas:')
    especialidades.forEach((esp, index) => {
      console.log(`   ${index + 1}. ${esp}`)
    })
    
  } catch (error) {
    console.error('❌ Error en populateSpecialties:', error)
  }
}

// Ejecutar la función
populateSpecialties()
