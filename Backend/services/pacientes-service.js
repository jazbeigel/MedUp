import PacientesRepository from './../repositories/pacientes-repository.js';

export default class PacientesService {
    constructor() {
        console.log('PacientesService.constructor()');
        this.PacientesRepository = new PacientesRepository();
    }

    getAllAsync = async () => {
        console.log(`PacientesService.getAllAsync()`);
        const returnArray = await this.PacientesRepository.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`PacientesService.getByIdAsync(${id})`);
        const returnEntity = await this.PacientesRepository.getByIdAsync(id);
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`PacientesService.createAsync(${JSON.stringify(entity)})`);
        const rowsAffected = await this.PacientesRepository.createAsync(entity);
        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(`PacientesService.updateAsync(${JSON.stringify(entity)})`);
        const rowsAffected = await this.PacientesRepository.updateAsync(entity);
        return rowsAffected;
    }
    
    deleteByIdAsync = async (id) => {
        console.log(`PacientesService.deleteByIdAsync(${id})`);
        const rowsAffected = await this.PacientesRepository.deleteByIdAsync(id);
        return rowsAffected;
    }

    /*
    getByIdAsync_PPT = async (id) => {
        console.log('Estoy en: PacientesService.getByIdAsync_PPT()');
        const returnEntity = await this.PacientesRepository.getByIdAsync_PPT(id);
        return returnEntity;
    }
    */
}
