import Paciente from './pacienteModel.js';
import Consulta from './consultaModel.js';

Consulta.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });
Paciente.hasMany(Consulta, { foreignKey: 'pacienteId', as: 'consultas' });

export { Paciente, Consulta };
