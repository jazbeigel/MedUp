import TurnosRepository from './../repositories/turnos-repository.js';

export default class TurnosService {
  constructor() {
    console.log('TurnosService.constructor()');
    this.TurnosRepository = new TurnosRepository();
  }

  listAsync = async (filters) => {
    return this.TurnosRepository.listAsync(filters);
  };

  getAllAsync = async () => {
    return this.TurnosRepository.getAllAsync();
  };

  getByIdAsync = async (id) => {
    return this.TurnosRepository.getByIdAsync(id);
  };

  createAsync = async (entity) => {
    return this.TurnosRepository.createAsync(entity);
  };

  updateAsync = async (entity) => {
    return this.TurnosRepository.updateAsync(entity);
  };

  updateEstadoAsync = async (id, estado) => {
    return this.TurnosRepository.updateEstadoAsync(id, estado);
  };
}
