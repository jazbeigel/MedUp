import LogHelper from './../helpers/log-helper.js';
import PgPool from './../helpers/pg-pool.js';

export default class TurnosRepository {
  constructor() {
    this.db = PgPool;
  }

  getDBPool() {
    return this.db.getPool();
  }

  listAsync = async (filters) => {
    try {
      let sql = `
        SELECT t.*, 
               p.nombre AS paciente_nombre, 
               pr.nombre AS profesional_nombre,
               e.descripcion AS especialidad
        FROM turnos t
        LEFT JOIN pacientes p ON t.paciente_id = p.id
        LEFT JOIN profesionales pr ON t.profesional_id = pr.id
        LEFT JOIN especialidades e ON t.especialidad_id = e.id
        WHERE 1 = 1
      `;
      
      const values = [];
      let i = 1;

      if (filters?.profesional_id) {
        sql += ` AND t.profesional_id = $${i++}`;
        values.push(filters.profesional_id);
      }

      if (filters?.paciente_id) {
        sql += ` AND t.paciente_id = $${i++}`;
        values.push(filters.paciente_id);
      }

      sql += ' ORDER BY t.fecha ASC';

      const result = await this.getDBPool().query(sql, values);
      return result.rows;

    } catch (error) {
      LogHelper.logError(error);
      throw error;
    }
  };

  getAllAsync = async () => {
    try {
      const sql = 'SELECT * FROM turnos ORDER BY fecha DESC';
      const result = await this.getDBPool().query(sql);
      return result.rows;
    } catch (error) {
      LogHelper.logError(error);
      throw error;
    }
  };

  getByIdAsync = async (id) => {
    try {
      const sql = 'SELECT * FROM turnos WHERE id = $1';
      const result = await this.getDBPool().query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      LogHelper.logError(error);
      throw error;
    }
  };

  // 🚀 CREATE ARREGLADO: YA NO BORRA CAMPOS NI HACE UPDATE INNECESARIO
  createAsync = async (entity) => {
    try {
      console.log("XXXX: " +  entity.descripcion);
      const sql = `
        INSERT INTO turnos (
          paciente_id,
          profesional_id,
          fecha,
          creado_el,
          estado,
          descripcion,
          especialidad_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING id
      `;

      const values = [
        entity.paciente_id,
        entity.profesional_id,
        entity.fecha,
        new Date(),
        entity.estado,
        entity.descripcion,
        entity.especialidad_id,
      ];

      const resultPg = await this.getDBPool().query(sql, values);
      return resultPg.rows[0].id;

    } catch (error) {
      LogHelper.logError(error);
      throw error;
    }
  };

  updateAsync = async (entity) => {
    try {
      const sql = `
        UPDATE turnos SET
          paciente_id = $2,
          profesional_id = $3,
          fecha = $4,
          estado = $5,
          descripcion = $6,
          especialidad_id = $7
        WHERE id = $1
      `;

      const values = [
        entity.id,
        entity.paciente_id,
        entity.profesional_id,
        entity.fecha,
        entity.estado,
        entity.descripcion ?? null,
        entity.especialidad_id ?? null
      ];

      await this.getDBPool().query(sql, values);
      return true;

    } catch (error) {
      LogHelper.logError(error);
      throw error;
    }
  };

  updateEstadoAsync = async (id, estado) => {
    try {
      const sql = `UPDATE turnos SET estado = $2 WHERE id = $1`;
      await this.getDBPool().query(sql, [id, estado]);
      return true;
    } catch (error) {
      LogHelper.logError(error);
      throw error;
    }
  };
}
