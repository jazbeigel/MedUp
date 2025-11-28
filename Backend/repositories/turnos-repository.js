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

    listAsync = async (filters) => {
        try {
            let sql = `SELECT * FROM turnos WHERE 1 = 1`;

            const values = [];
            let i = 1;

            if (filters?.profesionalId) {
                sql += ` AND profesional_id = $${i++}`;
                values.push(filters.profesionalId);
            }

            if (filters?.pacienteId) {
                sql += ` AND paciente_id = $${i++}`;
                values.push(filters.pacienteId);
            }

            if (filters?.estado) {
                sql += ` AND estado = $${i++}`;
                values.push(filters.estado);
            }

            sql += ' ORDER BY fecha ASC';

            const resultPg = await this.getDBPool().query(sql, values);
            return resultPg.rows ?? [];

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
            const sql = `
                SELECT *
                FROM turnos
                WHERE id = $1
                LIMIT 1
            `;
            const result = await this.getDBPool().query(sql, [id]);
            return result.rows[0] ?? null;
        } catch (error) {
            LogHelper.logError(error);
            throw error;
        }
    };


    createAsync = async (entity) => {
        try {
            const sql = `
                INSERT INTO turnos (
                    paciente_id,
                    profesional_id,
                    fecha,
                    estado,
                    descripcion,
                    especialidad_id
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id;
            `;

            const values = [
                entity.paciente_id,
                entity.profesional_id,
                entity.fecha,
                entity.estado,
                entity.descripcion,
                entity.especialidad_id
            ];

            const result = await this.getDBPool().query(sql, values);
            return result.rows[0].id;

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
                entity.descripcion,
                entity.especialidad_id
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

