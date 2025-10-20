import ProfesionalesRepository from './../repositories/profesionales-repository.js';

export default class ProfesionalesService {
    constructor() {
        console.log('ProfesionalesService.constructor()');
        this.ProfesionalesRepository = new ProfesionalesRepository();
    }

    getAllAsync = async () => {
        console.log(`ProfesionalesService.getAllAsync()`);
        const returnArray = await this.ProfesionalesRepository.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`ProfesionalesService.getByIdAsync(${id})`);
        const returnEntity = await this.ProfesionalesRepository.getByIdAsync(id);
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`ProfesionalesService.createAsync(${JSON.stringify(entity)})`);
        const rowsAffected = await this.ProfesionalesRepository.createAsync(entity);
        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(`ProfesionalesService.updateAsync(${JSON.stringify(entity)})`);
        const rowsAffected = await this.ProfesionalesRepository.updateAsync(entity);
        return rowsAffected;
    }
    
    deleteByIdAsync = async (id) => {
        console.log(`ProfesionalesService.deleteByIdAsync(${id})`);
        const rowsAffected = await this.ProfesionalesRepository.deleteByIdAsync(id);
        return rowsAffected;
    }
    getByEmailAsync = async (email) => {
        console.log(`ProfesionalesService.getByEmailAsync(${email})`);
        const paciente = await this.ProfesionalesRepository.getByEmailAsync(email);
        return paciente;
    }


    /*
    getByIdAsync_PPT = async (id) => {
        console.log('Estoy en: ProfesionalesService.getByIdAsync_PPT()');
        const returnEntity = await this.ProfesionalesRepository.getByIdAsync_PPT(id);
        return returnEntity;
    }
    */
}
