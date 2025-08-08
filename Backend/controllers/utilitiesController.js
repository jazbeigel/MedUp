import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabase = createClient(
  'https://qhtjlctnsoajgouinjaq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodGpsY3Ruc29hamdvdWluamFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMzU2NjMsImV4cCI6MjA2NDYxMTY2M30.AVpXetLCSZLG_hg0W4wSJGVvXuwaIiwo983QZZAshI8'
);

// Obtener especialidades
export const getEspecialidades = async (req, res) => {
  try {
    console.log('🔍 Obteniendo especialidades...');
    
    const { data, error } = await supabase
      .from('especialidades')
      .select('id, nombre')
      .order('nombre');
    
    if (error) {
      console.error('Error obteniendo especialidades:', error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    
    console.log(`✅ Especialidades obtenidas: ${data.length}`);
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo especialidades:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Verificar disponibilidad de DNI/Matrícula
export const checkAvailability = async (req, res) => {
  try {
    const { dni, matricula } = req.body;
    
    let exists = false;
    
    if (dni) {
      const { data: paciente, error: pacienteError } = await supabase
        .from('pacientes')
        .select('id')
        .eq('dni', dni)
        .single();
      
      if (pacienteError && pacienteError.code !== 'PGRST116') {
        console.error('Error verificando DNI:', pacienteError);
        return res.status(500).json({ error: "Error verificando DNI" });
      }
      
      exists = exists || paciente;
    }
    
    if (matricula) {
      const { data: profesional, error: profesionalError } = await supabase
        .from('profesionales')
        .select('id')
        .eq('matricula', matricula)
        .single();
      
      if (profesionalError && profesionalError.code !== 'PGRST116') {
        console.error('Error verificando matrícula:', profesionalError);
        return res.status(500).json({ error: "Error verificando matrícula" });
      }
      
      exists = exists || profesional;
    }
    
    res.json({ available: !exists });
  } catch (error) {
    console.error("Error verificando disponibilidad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
