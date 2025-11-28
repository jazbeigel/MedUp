import pkg from 'pg';
import config from './../configs/db-config.js';
import LogHelper from './../helpers/log-helper.js';

const { Pool } = pkg;

export default class PacientesRepository {
  constructor() {
    console.log('PacientesRepository.constructor()');
    this.DBPool = null;
  }

  getDBPool = () => {
    if (this.DBPool == null) {
      this.DBPool = new Pool(config);
    }
    return this.DBPool;
  };

  // Obtener todos los pacientes
  getAllAsync = async () => {
    console.log(`PacientesRepository.getAllAsync()`);
    try {
      const sql = `SELECT * FROM pacientes`;
      const resultPg = await this.getDBPool().query(sql);
      return resultPg.rows;
    } catch (error) {
      LogHelper.logError(error);
      return null;
    }
  };

  // Obtener paciente por ID
  getByIdAsync = async (id) => {
    console.log(`PacientesRepository.getByIdAsync(${id})`);
    try {
      const sql = `SELECT * FROM pacientes WHERE id=$1`;
      const values = [id];
      const resultPg = await this.getDBPool().query(sql, values);
      return resultPg.rows[0] ?? null;
    } catch (error) {
      LogHelper.logError(error);
      return null;
    }
  };

  // Crear paciente
  createAsync = async (entity) => {
    try {
      const sql = `
        INSERT INTO pacientes (
          usuario_id,
          nombre_completo,
          fecha_nacimiento,
          dni,
          email,
          direccion,
          telefono,
          contrasena
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *;
      `;
      const values = [
        entity.usuario_id || null,
        entity.nombre_completo,
        entity.fecha_nacimiento,   // 'YYYY-MM-DD'
        entity.dni,
        entity.email,
        entity.direccion,
        entity.telefono,
        entity.contrasena
      ];
      const resultPg = await this.getDBPool().query(sql, values); // 👈 usar el pool de la clase
      return resultPg.rows[0];
    } catch (error) {
      LogHelper.logError(error);
      throw error; // que suba el error al service/controller
    }
  };

  // Actualizar paciente (agrego email)
  updateAsync = async (entity) => {
    console.log(`PacientesRepository.updateAsync(${JSON.stringify(entity)})`);
    const id = entity.id;
    try {
      const previous = await this.getByIdAsync(id);
      if (!previous) return 0;

      const sql = `
        UPDATE pacientes SET
          usuario_id       = $2,
          nombre_completo  = $3,
          fecha_nacimiento = $4,
          dni              = $5,
          email            = $6,
          direccion        = $7,
          telefono         = $8,
          contrasena       = $9
        WHERE id = $1
      `;
      const values = [
        id,
        entity?.usuario_id       ?? previous.usuario_id,
        entity?.nombre_completo  ?? previous.nombre_completo,
        entity?.fecha_nacimiento ?? previous.fecha_nacimiento,
        entity?.dni              ?? previous.dni,
        entity?.email            ?? previous.email,          // 👈 agregado
        entity?.direccion        ?? previous.direccion,
        entity?.telefono         ?? previous.telefono,
        entity?.contrasena         ?? previous.contrasena
      ];
      const resultPg = await this.getDBPool().query(sql, values);
      return resultPg.rowCount;
    } catch (error) {
      LogHelper.logError(error);
      return 0;
    }
  };

  // Eliminar paciente
  deleteByIdAsync = async (id) => {
    console.log(`PacientesRepository.deleteByIdAsync(${id})`);
    try {
      const sql = `DELETE FROM pacientes WHERE id=$1`;
      const resultPg = await this.getDBPool().query(sql, [id]);
      return resultPg.rowCount;
    } catch (error) {
      LogHelper.logError(error);
      return 0;
    }
  };
  // NUEVO: obtener paciente por email
  getByEmailAsync = async (email) => {
    console.log(`PacientesRepository.getByEmailAsync(${email})`);
    try {
      const sql = `SELECT * FROM pacientes WHERE LOWER(email)=LOWER($1) LIMIT 1`;
      const values = [email];
      const resultPg = await this.getDBPool().query(sql, values);
      return resultPg.rows[0] ?? null;
    } catch (error) {
      LogHelper.logError(error);
      return null;
    }
  };
}
