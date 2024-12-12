import sequelize from './config/database.js';
import Paciente from './models/pacienteModel.js';
import Consulta from './models/consultaModel.js';
import Terminal from './models/Terminal.js';

async function inicializarBancoDeDados() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    await sequelize.sync({ alter: true });
    console.log('Tabelas sincronizadas com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error);
    process.exit(1);
  }
}

async function main() {
  await inicializarBancoDeDados();

  const terminal = new Terminal();
  terminal.exibirMenuPrincipal();
}

main();
