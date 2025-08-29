import PacientesService from './pacientes-service.js';
import ProfesionalesService from './profesionales-service.js';
import supabase from '../repositories/supabaseClient.js';

export default class AuthService {
  constructor() {
    this.pacientesService = new PacientesService();
    this.profesionalesService = new ProfesionalesService();
  }

  registerAsync = async (entity) => {
    const { userType, email, password, nombre_completo, fecha_nacimiento, dni, direccion, telefono, matricula, especialidad } = entity;
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    const userId = data.user.id;

    if (userType === 'paciente') {
      await this.pacientesService.createAsync({
        usuario_id: userId,
        nombre_completo,
        fecha_nacimiento,
        dni,
        direccion,
        telefono,
        email
      });
    } else if (userType === 'doctor') {
      await this.profesionalesService.createAsync({
        usuario_id: userId,
        nombre_completo,
        matricula,
        id_especialidad: parseInt(especialidad, 10),
        telefono,
        email
      });
    }
    return { userId };
  }

  loginAsync = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { user: data.user };
  }

  getUserByEmailAsync = async (email) => {
    const { data, error } = await supabase.auth.admin.getUserByEmail(email);
    if (error) throw error;
    return data.user;
  }
}
