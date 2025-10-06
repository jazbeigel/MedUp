import pkg          from 'pg'
import config       from './../configs/db-config.js';      // Traigo la configuracion de la base de datos.
import LogHelper    from './../helpers/log-helper.js'

const { Pool }  = pkg;

export default class TurnosRepository {
    constructor() {
        // Se ejecuta siempre, (al instanciar la clase)
        console.log('TurnosRepository.constructor()');
        this.DBPool     = null;
    }

    getDBPool = () => {
        if (this.DBPool == null){
            this.DBPool = new Pool(config);
        }
        return this.DBPool;
    }

    getAllAsync = async () => {
        console.log(`TurnosRepository.getAllAsync()`);
        let returnArray = null;
        
        try {
            const sql = `SELECT * FROM Turnos`;
            const resultPg = await this.getDBPool().query(sql);
            returnArray = resultPg.rows;
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`TurnosRepository.getByIdAsync(${id})`);
        let returnEntity = null;
        try {
            const sql = `SELECT * FROM Turnos WHERE id=$1`;
            const values = [id];
            const resultPg = await this.getDBPool().query(sql, values);
            if (resultPg.rows.length > 0){
                returnEntity = resultPg.rows[0];
            }
        } catch (error) {
            LogHelper.logError(error);
        } 
        return returnEntity;
    }

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
                new Date()
            ];
    
            const resultPg = await this.getDBPool().query(sql, values);
            newId = resultPg.rows[0].id;
        } catch (error) {
            console.error(error);
        }
        return newId;
    }
    
    
    updateAsync = async (entity) => {
        console.log(`TurnosRepository.updateAsync(${JSON.stringify(entity)})`);
        let rowsAffected = 0;
        const id = Number(entity.id);
      
        try {
          // Verifico que exista
          const previous = await this.getByIdAsync(id);
          if (!previous) return 0;
      
          const sql = `
            UPDATE turnos SET
              estado = COALESCE($2, estado),
              paciente_id = COALESCE($3, paciente_id),
              profesional_id = COALESCE($4, profesional_id),
              fecha = COALESCE($5, fecha)
            WHERE id = $1
          `;
      
          const values = [
            id,                                // $1
            entity.estado ?? null,             // $2
            entity.paciente_id ?? null,        // $3
            entity.profesional_id ?? null,     // $4
            entity.fecha ?? null               // $5
          ];
      
          const resultPg = await this.getDBPool().query(sql, values);
          rowsAffected = resultPg.rowCount;
        } catch (error) {
          LogHelper.logError(error);
        }
        return rowsAffected;
      }      
    /*
    deleteByIdAsync = async (id) => {
        console.log(`TurnosRepository.deleteByIdAsync(${id})`);
        let rowsAffected = 0;
        
        try {
            const sql = `DELETE from Turnos WHERE id=$1`;
            const values = [id];
            const resultPg = await this.getDBPool().query(sql, values);
            rowsAffected = resultPg.rowCount;
        } catch (error) {
            LogHelper.logError(error);
        }
        return rowsAffected;
    }
}*/}