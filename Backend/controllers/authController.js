import { createClient } from '@supabase/supabase-js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

// Crear cliente de Supabase
const supabase = createClient(
  'https://qhtjlctnsoajgouinjaq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodGpsY3Ruc29hamdvdWluamFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMzU2NjMsImV4cCI6MjA2NDYxMTY2M30.AVpXetLCSZLG_hg0W4wSJGVvXuwaIiwo983QZZAshI8'
);

// Middleware para validar datos de registro
export const validateRegistrationData = (req, res, next) => {
  const { email, password, nombre_completo, fecha_nacimiento, dni, direccion, telefono, tipo_usuario } = req.body;
  
  if (!email || !password || !nombre_completo || !fecha_nacimiento || !dni || !direccion || !telefono || !tipo_usuario) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (!["paciente", "profesional"].includes(tipo_usuario)) {
    return res.status(400).json({ error: "Tipo de usuario debe ser 'paciente' o 'profesional'" });
  }

  next();
};

// Registro de usuarios
export const registerUser = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      nombre_completo, 
      fecha_nacimiento, 
      dni, 
      direccion, 
      telefono, 
      tipo_usuario,
      matricula,
      especialidad,
      id_especialidad
    } = req.body;

    console.log('Registrando usuario:', { email, tipo_usuario, dni, matricula });

    // Verificar si el DNI ya existe para pacientes
    if (tipo_usuario === "paciente") {
      const { data: existingPaciente, error: pacienteError } = await supabase
        .from('pacientes')
        .select('*')
        .eq('dni', dni)
        .single();

      if (pacienteError && pacienteError.code !== 'PGRST116') {
        console.error('Error verificando DNI:', pacienteError);
        return res.status(500).json({ error: "Error verificando DNI" });
      }

      if (existingPaciente) {
        return res.status(409).json({ error: "Ya existe un paciente con este DNI" });
      }
    }

    // Verificar si la matrícula ya existe para profesionales
    if (tipo_usuario === "profesional") {
      const { data: existingProfesional, error: profesionalError } = await supabase
        .from('profesionales')
        .select('*')
        .eq('matricula', matricula)
        .single();

      if (profesionalError && profesionalError.code !== 'PGRST116') {
        console.error('Error verificando matrícula:', profesionalError);
        return res.status(500).json({ error: "Error verificando matrícula" });
      }

      if (existingProfesional) {
        return res.status(409).json({ error: "Ya existe un profesional con esta matrícula" });
      }
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      console.error('Error en autenticación:', authError);
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      return res.status(400).json({ error: "Error creando usuario" });
    }

    // Insertar en la tabla correspondiente
    let userData;
    const userRecord = {
      usuario_id: authData.user.id,
      nombre_completo,
      telefono
    };

    if (tipo_usuario === "paciente") {
      const { data, error } = await supabase
        .from('pacientes')
        .insert([{
          ...userRecord,
          fecha_nacimiento,
          dni,
          direccion
        }])
        .select()
        .single();

      if (error) {
        console.error('Error insertando paciente:', error);
        return res.status(500).json({ error: "Error creando paciente" });
      }

      userData = data;
    } else if (tipo_usuario === "profesional") {
      if (!matricula || !especialidad || !id_especialidad) {
        return res.status(400).json({ error: "Profesionales requieren matrícula, especialidad e ID de especialidad" });
      }

      const { data, error } = await supabase
        .from('profesionales')
        .insert([{
          ...userRecord,
          matricula,
          especialidad,
          id_especialidad
        }])
        .select()
        .single();

      if (error) {
        console.error('Error insertando profesional:', error);
        return res.status(500).json({ error: "Error creando profesional" });
      }

      userData = data;
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: authData.user.id, tipo_usuario },
      config.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: authData.user.id,
        tipo_usuario,
        ...userData
      }
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Login de usuarios
export const loginUser = async (req, res) => {
  try {
    const { email, password, tipo_usuario } = req.body;

    if (!email || !password || !tipo_usuario) {
      return res.status(400).json({ error: "Email, contraseña y tipo de usuario son requeridos" });
    }

    // Autenticar con Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Buscar usuario en la tabla correspondiente
    let user;
    
    if (tipo_usuario === "paciente") {
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('usuario_id', authData.user.id)
        .single();

      if (error) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }

      user = data;
    } else if (tipo_usuario === "profesional") {
      const { data, error } = await supabase
        .from('profesionales')
        .select('*')
        .eq('usuario_id', authData.user.id)
        .single();

      if (error) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }

      user = data;
    }

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const token = jwt.sign(
      { userId: authData.user.id, tipo_usuario },
      config.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: authData.user.id,
        nombre_completo: user.nombre_completo,
        tipo_usuario
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
