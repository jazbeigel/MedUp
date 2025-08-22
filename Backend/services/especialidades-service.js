import EspecialidadesRepository from './../repositories/especialidades-repository.js';

export default class EspecialidadesService {
    constructor() {
        console.log('EspecialidadesService.constructor()');
        this.EspecialidadesRepository = new EspecialidadesRepository();
    }

    getAllAsync = async () => {
        console.log(`EspecialidadesService.getAllAsync()`);
        const returnArray = await this.EspecialidadesRepository.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`EspecialidadesService.getByIdAsync(${id})`);
        const returnEntity = await this.EspecialidadesRepository.getByIdAsync(id);
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`EspecialidadesService.createAsync(${JSON.stringify(entity)})`);
        const rowsAffected = await this.EspecialidadesRepository.createAsync(entity);
        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(`EspecialidadesService.updateAsync(${JSON.stringify(entity)})`);
        const rowsAffected = await this.EspecialidadesRepository.updateAsync(entity);
        return rowsAffected;
    }
    
    deleteByIdAsync = async (id) => {
        console.log(`EspecialidadesService.deleteByIdAsync(${id})`);
        const rowsAffected = await this.EspecialidadesRepository.deleteByIdAsync(id);
        return rowsAffected;
    }

    /*
    getByIdAsync_PPT = async (id) => {
        console.log('Estoy en: EspecialidadesService.getByIdAsync_PPT()');
        const returnEntity = await this.EspecialidadesRepository.getByIdAsync_PPT(id);
        return returnEntity;
    }
    */
}
