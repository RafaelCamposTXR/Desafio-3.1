import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { DateTime } from 'luxon';

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
    type: DataTypes.STRING,  // Mudando de TIME para STRING
    allowNull: false,
    validate: {
      is: /^\d{2}:\d{2}$/,  // Validação para hora no formato HH:mm
    },
    set(value) {
      // Garantir que o valor passado seja uma string no formato HH:mm
      const horaInicioObj = DateTime.fromFormat(value, 'HH:mm');
      if (horaInicioObj.isValid) {
        this.setDataValue('horaInicio', horaInicioObj.toFormat('HH:mm'));  // Armazenar no formato correto
      } else {
        throw new Error("Formato de hora inválido para 'horaInicio'. O formato deve ser HH:mm.");
      }
    }
  },
  horaFim: {
    type: DataTypes.STRING,  // Mudando de TIME para STRING
    allowNull: false,
    validate: {
      is: /^\d{2}:\d{2}$/,  // Validação para hora no formato HH:mm
    },
    set(value) {
      // Garantir que o valor passado seja uma string no formato HH:mm
      const horaFimObj = DateTime.fromFormat(value, 'HH:mm');
      if (horaFimObj.isValid) {
        this.setDataValue('horaFim', horaFimObj.toFormat('HH:mm'));  // Armazenar no formato correto
      } else {
        throw new Error("Formato de hora inválido para 'horaFim'. O formato deve ser HH:mm.");
      }
    }
  },
}, {
  tableName: 'consultas',
  timestamps: true,
});

export default Consulta;
