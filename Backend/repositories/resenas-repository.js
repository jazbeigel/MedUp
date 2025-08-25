import pkg          from 'pg'
import config       from '../configs/db-config.js';      // Traigo la configuracion de la base de datos.
import LogHelper    from '../helpers/log-helper.js'

const { Pool } = pkg;

export default class ResenasRepository {
    constructor() {
        console.log('ResenasRepository.constructor()');
        this.DBPool = null;
    }

    getDBPool = () => {
        if (this.DBPool == null) {
            this.DBPool = new Pool(config);
        }
        return this.DBPool;
    };

    getAllAsync = async () => {
        console.log(`ResenasRepository.getAllAsync()`);
        let returnArray = null;

        try {
            const sql = 'SELECT * FROM resenas;';
            const resultPg = await this.getDBPool().query(sql);
            returnArray = resultPg.rows;
        } catch (error) {
            LogHelper.logError(error);
        }
        return returnArray;
    };

    getByIdAsync = async (id) => {
        console.log(`ResenasRepository.getByIdAsync(${id})`);
        let returnEntity = null;
        try {
            const sql = 'SELECT * FROM resenas WHERE id=$1;';
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
        console.log(`ResenasRepository.createAsync(${JSON.stringify(entity)})`);
        let newId = 0;

        try {
            const sql = `INSERT INTO resenas (
                            calificacion,
                            comentario,
                            fecha,
                            id_turno
                        ) VALUES (
                            $1,
                            $2,
                            $3,
                            $4
                        ) RETURNING id;`;
            const values = [
                entity?.calificacion ?? '',
                entity?.comentario ?? '',
                entity?.fecha ?? '',
                entity?.id_turno ?? ''
            ];
            const resultPg = await this.getDBPool().query(sql, values);
            newId = resultPg.rows[0].id;
        } catch (error) {
            LogHelper.logError(error);
        }
        return newId;
    };
}
