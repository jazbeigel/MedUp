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
            if (resultPg.rows.length > 0){
                returnEntity = resultPg.rows[0];
            }
        } catch (error) {
            LogHelper.logError(error);
        } 
        return returnEntity;
    }

    createAsync = async (entity) => {
    console.log(`ProfesionalesRepository.createAsync(${JSON.stringify(entity)})`);
    try {
        const sql = `
        INSERT INTO profesionales (
            nombre_completo,
            matricula,
            email,
            telefono,
            id_especialidad,
            contrasena
        ) VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id;
        `;
        const values = [
        entity?.nombre_completo ?? '',
        entity?.matricula ?? '',
        entity?.email ?? '',
        entity?.telefono ?? '',
        entity?.id_especialidad ?? null,
        entity?.contrasena ?? null
        ];
        const resultPg = await this.getDBPool().query(sql, values);
        return resultPg.rows[0].id; // devolvés el id nuevo
    } catch (error) {
        LogHelper.logError(error);
        throw error;
    }
    };

    updateAsync = async (entity) => {
    console.log(`ProfesionalesRepository.updateAsync(${JSON.stringify(entity)})`);
    const id = entity.id;
    try {
        const prev = await this.getByIdAsync(id);
        if (!prev) return 0;

        const sql = `
        UPDATE profesionales SET
            nombre_completo = $2,
            matricula       = $3,
            email           = $4,
            telefono        = $5,
            id_especialidad = $6,
            contrasena      = $7
        WHERE id = $1
        `;
        const values = [
        id,
        entity?.nombre_completo ?? prev.nombre_completo,
        entity?.matricula       ?? prev.matricula,
        entity?.email           ?? prev.email,
        entity?.telefono        ?? prev.telefono,
        entity?.id_especialidad ?? prev.id_especialidad,
        entity?.contrasena ?? prev.contrasena
        ];
        const resultPg = await this.getDBPool().query(sql, values);
        return resultPg.rowCount;
    } catch (error) {
        LogHelper.logError(error);
        return 0;
    }
    };

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
/*
Este operador (??) retorna el lado derecho de la operación cuando el lado izquierdo es un valor falsy.

falsy es un valor que se considera false (false). 
En Javascript existen sólo 6 valores falsy: undefined, null, NaN, 0, "" (string vacio) y false.

console.log(12 || "not found") // 12
console.log(0  || "not found") // "not found"

console.log("jane" || "not found") // "jane"
console.log(""     || "not found") // "not found"

console.log(true  || "not found") // true
console.log(false || "not found") // "not found"

console.log(undefined || "not found") // "not found"
console.log(null      || "not found") // "not found"
----------------------------------------------------
console.log(12 ?? "not found") // 12
console.log(0  ?? "not found") // 0

console.log("jane" ?? "not found") // "jane"
console.log(""     ?? "not found") // ""

console.log(true  ?? "not found") // true
console.log(false ?? "not found") // false

console.log(undefined ?? "not found") // "not found"
console.log(null      ?? "not found") // "not found"
*/