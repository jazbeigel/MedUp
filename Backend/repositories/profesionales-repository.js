import pkg          from 'pg'
import config       from './../configs/db-config.js';      // Traigo la configuracion de la base de datos.
import LogHelper    from './../helpers/log-helper.js'

const { Pool }  = pkg;

export default class ProfesionalesRepository {
    constructor() {
        // Se ejecuta siempre, (al instanciar la clase)
        console.log('ProfesionalesRepository.constructor()');
        this.DBPool     = null;
    }

    getDBPool = () => {
        if (this.DBPool == null){
            this.DBPool = new Pool(config);
        }
        return this.DBPool;
    }

    getAllAsync = async () => {
        console.log(`ProfesionalesRepository.getAllAsync()`);
        let returnArray = null;
        
        try {
            const sql = `SELECT * FROM profesionales`;
            const resultPg = await this.getDBPool().query(sql);
            returnArray = resultPg.rows;
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`ProfesionalesRepository.getByIdAsync(${id})`);
        let returnEntity = null;
        try {
            const sql = `SELECT * FROM profesionales WHERE id=$1`;
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

    getByEmailAsync = async (email) => {
        console.log(`ProfesionalesRepository.getByEmailAsync(${email})`);
        let returnEntity = null;
        try {
            const sql = `SELECT * FROM profesionales WHERE email=$1`;
            const values = [email];
            const resultPg = await this.getDBPool().query(sql, values);
            if (resultPg.rows.length > 0) {
                returnEntity = resultPg.rows[0];
            }
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`ProfesionalesRepository.createAsync(${JSON.stringify(entity)})`);
        let newId = 0;

        try {
            const sql = ` INSERT INTO profesionales (
                            nombre_completo,
                            matricula,
                            telefono,
                            id_especialidad,
                            email
                        ) VALUES (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5
                        ) RETURNING id`;
            const values = [
                entity?.nombre_completo ?? '',
                entity?.matricula ?? '',
                entity?.telefono ?? '',
                entity?.id_especialidad ?? null,
                entity?.email ?? null
            ];
            const resultPg = await this.getDBPool().query(sql, values);
            newId = resultPg.rows[0].id;
        } catch (error) {
            LogHelper.logError(error);
        }
        return newId;
    }

    updateAsync = async (entity) => {
        console.log(`ProfesionalesRepository.updateAsync(${JSON.stringify(entity)})`);
        let rowsAffected = 0;
        const id = entity.id;

        try {
            const previousEntity = await this.getByIdAsync(id);
            if (previousEntity == null) return 0;
            const sql = `UPDATE profesionales SET
                            nombre_completo = $2,
                            matricula = $3,
                            telefono = $4,
                            id_especialidad = $5,
                            email = $6
                        WHERE id = $1`;
            const values = [
                id,
                entity?.nombre_completo ?? previousEntity?.nombre_completo,
                entity?.matricula ?? previousEntity?.matricula,
                entity?.telefono ?? previousEntity?.telefono,
                entity?.id_especialidad ?? previousEntity?.id_especialidad,
                entity?.email ?? previousEntity?.email
            ];
            const resultPg = await this.getDBPool().query(sql, values);
            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }
    
    deleteByIdAsync = async (id) => {
        console.log(`ProfesionalesRepository.deleteByIdAsync(${id})`);
        let rowsAffected = 0;
        
        try {
            const sql = `DELETE from profesionales WHERE id=$1`;
            const values = [id];
            const resultPg = await this.getDBPool().query(sql, values);
            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }
}