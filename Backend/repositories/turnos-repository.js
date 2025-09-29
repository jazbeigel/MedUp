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

  getAllAsync = async () => {
    console.log('TurnosRepository.getAllAsync()');
    let returnArray = null;

    try {
      const sql = 'SELECT * FROM turnos ORDER BY fecha DESC';
      const resultPg = await this.getDBPool().query(sql);
      returnArray = resultPg.rows;
    } catch (error) {
      LogHelper.logError(error);
    }
    return returnArray;
  };

  getByIdAsync = async (id) => {
    console.log(`TurnosRepository.getByIdAsync(${id})`);
    let returnEntity = null;
    try {
      const sql = 'SELECT * FROM turnos WHERE id=$1';
      const values = [id];
      const resultPg = await this.getDBPool().query(sql, values);
      if (resultPg.rows.length > 0) {
        returnEntity = resultPg.rows[0];
      }
    } catch (error) {
      LogHelper.logError(error);
    }
    return returnEntity;
  };

  createAsync = async (entity) => {
    let newId = 0;
    try {
      const sql = `
        INSERT INTO turnos (
          paciente_id,
          profesional_id,
          fecha,
          creado_el
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
      `;

      const values = [
        entity.paciente_id,
        entity.profesional_id,
        entity.fecha,
        new Date(),
      ];

      const resultPg = await this.getDBPool().query(sql, values);
      newId = resultPg.rows[0].id;
    } catch (error) {
      LogHelper.logError(error);
    }
    return newId;
  };

  updateAsync = async (entity) => {
    console.log(`TurnosRepository.updateAsync(${JSON.stringify(entity)})`);
    let updatedEntity = null;
    const id = entity.id;

    if (!id) {
      return null;
    }

    try {
      const previousEntity = await this.getByIdAsync(id);
      if (previousEntity == null) return null;

      const sql = `
        UPDATE turnos SET
          paciente_id = $2,
          profesional_id = $3,
          fecha = $4,
          estado = COALESCE($5, estado)
        WHERE id = $1
        RETURNING *
      `;

      const values = [
        id,
        entity?.paciente_id ?? previousEntity?.paciente_id,
        entity?.profesional_id ?? previousEntity?.profesional_id,
        entity?.fecha ?? previousEntity?.fecha,
        entity?.estado ?? previousEntity?.estado ?? null,
      ];

      const resultPg = await this.getDBPool().query(sql, values);
      if (resultPg.rows.length > 0) {
        updatedEntity = resultPg.rows[0];
      }
    } catch (error) {
      LogHelper.logError(error);
    }
    return updatedEntity;
  };

  updateEstadoAsync = async (id, estado) => {
    console.log(`TurnosRepository.updateEstadoAsync(${id}, ${estado})`);
    let updatedEntity = null;

    try {
      const sql = `
        UPDATE turnos SET
          estado = $2
        WHERE id = $1
        RETURNING *
      `;

      const values = [id, estado];
      const resultPg = await this.getDBPool().query(sql, values);
      if (resultPg.rows.length > 0) {
        updatedEntity = resultPg.rows[0];
      }
    } catch (error) {
      LogHelper.logError(error);
    }

    return updatedEntity;
  };

  deleteByIdAsync = async (id) => {
    console.log(`TurnosRepository.deleteByIdAsync(${id})`);
    let rowsAffected = 0;

    try {
      const sql = 'DELETE FROM turnos WHERE id=$1';
      const values = [id];
      const resultPg = await this.getDBPool().query(sql, values);
      rowsAffected = resultPg.rowCount;
    } catch (error) {
      LogHelper.logError(error);
    }
    return rowsAffected;
  };
}
