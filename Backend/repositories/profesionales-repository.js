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
        let newId = 0;

        try {
            /*
            INSERT INTO "public"."profesionales" 
	("id", "nombre_completo", "matricula", "especialidad", "telefono", "id_especialidad") 
VALUES 
	('3', 'Pablo', '32132132', 'eliminar este ampo', '1114444', '1');
            */
            const sql = ` INSERT INTO profesionales (
                            nombre_completo         , 
                            matricula               , 
                            especialidad            , 
                            telefono                , 
                            id_especialidad
                        ) VALUES (
                            $1, 
                            $2, 
                            $3, 
                            $4, 
                            $5
                        ) RETURNING id`;
            const values =  [   entity?.nombre_completo         ?? '', 
                                entity?.matricula               ?? '', 
                                entity?.especialidad            ?? 'Eliminar', 
                                entity?.telefono                ?? '', 
                                entity?.id_especialidad         ?? null
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
        let id = entity.id;
        
        try {
            const previousEntity = await this.getByIdAsync(id);
            if (previousEntity== null) return 0;
            const sql = `UPDATE profesionales SET 
                            nombre              = $2, 
                            apellido            = $3, 
                            id_curso            = $4, 
                            fecha_nacimiento    = $5, 
                            hace_deportes       = $6
                        WHERE id = $1`;
                            
            const values =  [   id,     // $1
                                entity?.nombre              ?? previousEntity?.nombre, 
                                entity?.apellido            ?? previousEntity?.apellido, 
                                entity?.id_curso            ?? previousEntity?.id_curso, 
                                entity?.fecha_nacimiento    ?? previousEntity?.fecha_nacimiento, 
                                entity?.hace_deportes       ?? previousEntity?.hace_deportes
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