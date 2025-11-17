import pkg from 'pg';
import config from './../configs/db-config.js';
import LogHelper from './../helpers/log-helper.js';

const { Pool } = pkg;

export default class TurnosRepository {
  constructor() {
    console.log('TurnosRepository.constructor()');
    this.DBPool = null;
  }

  getDBPool = () => {
    if (this.DBPool == null) {
      this.DBPool = new Pool(config);
    }
    return this.DBPool;
  };

  listAsync = async (filters = {}) => {
    const whereParts = [];
    const values = [];

    if (filters.pacienteId) {
      values.push(filters.pacienteId);
      whereParts.push(`t.paciente_id = $${values.length}`);
    }
    if (filters.profesionalId) {
      values.push(filters.profesionalId);
      whereParts.push(`t.profesional_id = $${values.length}`);
    }
    if (filters.estado) {
      values.push(filters.estado);
      whereParts.push(`LOWER(t.estado) = LOWER($${values.length})`);
    }

    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

    try {
      const sql = `
        SELECT
          t.*,
          p.nombre_completo AS paciente_nombre,
          p.email AS paciente_email,
          prof.nombre_completo AS profesional_nombre,
          prof.email AS profesional_email,
          esp_turno.nombre AS especialidad_nombre
        FROM turnos t
        LEFT JOIN pacientes p ON p.id = t.paciente_id
        LEFT JOIN profesionales prof ON prof.id = t.profesional_id
        LEFT JOIN especialidades esp_turno ON esp_turno.id = COALESCE(t.especialidad_id, prof.id_especialidad)
        ${whereClause}
        ORDER BY t.creado_el DESC
      `;

      const resultPg = await this.getDBPool().query(sql, values);
      return resultPg.rows ?? [];
    } catch (error) {
      LogHelper.logError(error);
      return [];
    }
  };

  getAllAsync = async () => {
    return this.listAsync();
  };

  getByIdAsync = async (id) => {
    try {
      const sql = `
        SELECT
          t.*,
          p.nombre_completo AS paciente_nombre,
          prof.nombre_completo AS profesional_nombre,
          esp_turno.nombre AS especialidad_nombre
        FROM turnos t
        LEFT JOIN pacientes p ON p.id = t.paciente_id
        LEFT JOIN profesionales prof ON prof.id = t.profesional_id
        LEFT JOIN especialidades esp_turno ON esp_turno.id = COALESCE(t.especialidad_id, prof.id_especialidad)
        WHERE t.id = $1
        LIMIT 1
      `;
      const resultPg = await this.getDBPool().query(sql, [id]);
      return resultPg.rows[0] ?? null;
    } catch (error) {
      LogHelper.logError(error);
      return null;
    }
  };

  createAsync = async (entity) => {
    let newId = 0;
    try {
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
        entity.creado_el ?? new Date(),
        entity.estado ?? 'pendiente',
        entity.descripcion ?? null,
        entity.especialidad_id ?? null,
      ];

      const resultPg = await this.getDBPool().query(sql, values);
      newId = resultPg.rows[0].id;

      if (
        newId &&
        (entity.descripcion !== undefined || entity.especialidad_id !== undefined)
      ) {
        const updateSql = `
          UPDATE turnos SET
            descripcion = COALESCE($2, descripcion),
            especialidad_id = COALESCE($3, especialidad_id)
          WHERE id = $1
        `;
        const updateValues = [
          newId,
          entity.descripcion ?? null,
          entity.especialidad_id ?? null,
        ];
        await this.getDBPool().query(updateSql, updateValues);
      }
    } catch (error) {
      LogHelper.logError(error);
      throw error;
    }
    return newId;
  };

  updateEstadoAsync = async (id, estado) => {
    try {
      const sql = `
        UPDATE turnos
        SET estado = $2
        WHERE id = $1
      `;
      const resultPg = await this.getDBPool().query(sql, [id, estado]);
      return resultPg.rowCount ?? 0;
    } catch (error) {
      LogHelper.logError(error);
      return 0;
    }
  };

  updateAsync = async (entity) => {
    console.log(`TurnosRepository.updateAsync(${JSON.stringify(entity)})`);
    let rowsAffected = 0;
    const id = Number(entity.id);

    try {
      const previous = await this.getByIdAsync(id);
      if (!previous) return 0;

      const sql = `
        UPDATE turnos SET
          estado = COALESCE($2, estado),
          paciente_id = COALESCE($3, paciente_id),
          profesional_id = COALESCE($4, profesional_id),
          fecha = COALESCE($5, fecha),
          descripcion = COALESCE($6, descripcion),
          especialidad_id = COALESCE($7, especialidad_id)
        WHERE id = $1
      `;

      const values = [
        id,
        entity.estado ?? null,
        entity.paciente_id ?? null,
        entity.profesional_id ?? null,
        entity.fecha ?? null,
        entity.descripcion ?? null,
        entity.especialidad_id ?? null,
      ];

      const resultPg = await this.getDBPool().query(sql, values);
      rowsAffected = resultPg.rowCount;
    } catch (error) {
      LogHelper.logError(error);
    }
    return rowsAffected;
  };
}