import pkg from 'pg'
import config from './../configs/db-config.js'; // Config DB
import LogHelper from './../helpers/log-helper.js'

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
    }

    // Obtener todos los pacientes
    getAllAsync = async () => {
        console.log(`PacientesRepository.getAllAsync()`);
        let returnArray = null;

        try {
            const sql = `SELECT * FROM pacientes`;
            const resultPg = await this.getDBPool().query(sql);
            returnArray = resultPg.rows;
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnArray;
    }

    // Obtener paciente por ID
    getByIdAsync = async (id) => {
        console.log(`PacientesRepository.getByIdAsync(${id})`);
        let returnEntity = null;
        try {
            const sql = `SELECT * FROM pacientes WHERE id=$1`;
            const values = [id];
            const resultPg = await this.getDBPool().query(sql, values);
            if (resultPg.rows.length > 0) {
                returnEntity = resultPg.rows[0];
            }
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnEntity;
    }

    // Crear paciente
    createAsync = async (entity) => {
        console.log(`PacientesRepository.createAsync(${JSON.stringify(entity)})`);
        let newId = 0;

        try {
            const sql = `INSERT INTO pacientes (
                            usuario_id,
                            nombre_completo,
                            fecha_nacimiento,
                            dni,
                            direccion,
                            telefono
                        ) VALUES (
                            $1, $2, $3, $4, $5, $6
                        ) RETURNING id`;

            const values = [
                entity?.usuario_id ?? null,
                entity?.nombre_completo ?? '',
                entity?.fecha_nacimiento ?? null,
                entity?.dni ?? '',
                entity?.direccion ?? '',
                entity?.telefono ?? ''
            ];

            const resultPg = await this.getDBPool().query(sql, values);
            newId = resultPg.rows[0].id;
        } catch (error) {
            LogHelper.logError(error);
        }
        return newId;
    }

    // Actualizar paciente
    updateAsync = async (entity) => {
        console.log(`PacientesRepository.updateAsync(${JSON.stringify(entity)})`);
        let rowsAffected = 0;
        let id = entity.id;

        try {
            const previousEntity = await this.getByIdAsync(id);
            if (previousEntity == null) return 0;

            const sql = `UPDATE pacientes SET 
                            usuario_id = $2,
                            nombre_completo = $3,
                            fecha_nacimiento = $4,
                            dni = $5,
                            direccion = $6,
                            telefono = $7
                        WHERE id = $1`;

            const values = [
                id,
                entity?.usuario_id ?? previousEntity?.usuario_id,
                entity?.nombre_completo ?? previousEntity?.nombre_completo,
                entity?.fecha_nacimiento ?? previousEntity?.fecha_nacimiento,
                entity?.dni ?? previousEntity?.dni,
                entity?.direccion ?? previousEntity?.direccion,
                entity?.telefono ?? previousEntity?.telefono
            ];

            const resultPg = await this.getDBPool().query(sql, values);
            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }

    // Eliminar paciente
    deleteByIdAsync = async (id) => {
        console.log(`PacientesRepository.deleteByIdAsync(${id})`);
        let rowsAffected = 0;

        try {
            const sql = `DELETE FROM pacientes WHERE id=$1`;
            const values = [id];
            const resultPg = await this.getDBPool().query(sql, values);
            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }
}
