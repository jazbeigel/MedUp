import ResenasRepository from '../repositories/resenas-repository.js';

export default class ResenasService {
    constructor() {
        console.log('ResenasService.constructor()');
        this.ResenasRepository = new ResenasRepository();
    }

    getAllAsync = async () => {
        console.log(`ResenasService.getAllAsync()`);
        const returnArray = await this.ResenasRepository.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`ResenasService.getByIdAsync(${id})`);
        const returnEntity = await this.ResenasRepository.getByIdAsync(id);
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`ResenasService.createAsync(${JSON.stringify(entity)})`);
        const rowsAffected = await this.ResenasRepository.createAsync(entity);
        return rowsAffected;
    }
}