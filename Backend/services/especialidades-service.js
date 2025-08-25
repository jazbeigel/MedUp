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
}
