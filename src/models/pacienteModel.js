import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Paciente = sequelize.define('Paciente', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
    validate: {
      is: /^\d{11}$/, 
    },
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 100], 
    },
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true, 
    },
  },
}, {
  tableName: 'pacientes',
  timestamps: true, 
});

export default Paciente;
