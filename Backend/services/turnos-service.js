import TurnosRepository from './../repositories/turnos-repository.js';

export default class TurnosService {
    constructor() {
        console.log('TurnosService.constructor()');
        this.TurnosRepository = new TurnosRepository();
    }

    getAllAsync = async () => {
        console.log(`TurnosService.getAllAsync()`);
        const returnArray = await this.TurnosRepository.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`TurnosService.getByIdAsync(${id})`);
        const returnEntity = await this.TurnosRepository.getByIdAsync(id);
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`TurnosService.createAsync(${JSON.stringify(entity)})`);
        const rowsAffected = await this.TurnosRepository.createAsync(entity);
        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(`TurnosService.updateAsync(${JSON.stringify(entity)})`);
        const updatedEntity = await this.TurnosRepository.updateAsync(entity);
        return updatedEntity;
    }

    confirmarAsync = async (id) => {
        console.log(`TurnosService.confirmarAsync(${id})`);
        const updatedEntity = await this.TurnosRepository.updateEstadoAsync(id, 'C');
        return updatedEntity;
    }
    deleteByIdAsync = async (id) => {
        console.log(`TurnosService.deleteByIdAsync(${id})`);
        const rowsAffected = await this.TurnosRepository.deleteByIdAsync(id);
        return rowsAffected;
    }

    /*
    getByIdAsync_PPT = async (id) => {
        console.log('Estoy en: TurnosService.getByIdAsync_PPT()');
        const returnEntity = await this.TurnosRepository.getByIdAsync_PPT(id);
        return returnEntity;
    }
    */
}
