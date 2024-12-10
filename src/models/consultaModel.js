import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Paciente from './Paciente.js';

const Consulta = sequelize.define('Consulta', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  data: {
    type: DataTypes.DATEONLY, 
    allowNull: false,
    validate: {
      isDate: true, 
    },
  },
  horaInicio: {
    type: DataTypes.TIME, 
    allowNull: false,
    validate: {
      is: /^\d{2}:\d{2}$/, 
    },
  },
  horaFim: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^\d{2}:\d{2}$/, 
    },
  },
}, {
  tableName: 'consultas',
  timestamps: true, 
});


Consulta.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });
Paciente.hasMany(Consulta, { foreignKey: 'pacienteId', as: 'consultas' });

export default Consulta;
