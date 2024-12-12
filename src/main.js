import sequelize from './config/database.js';
import Paciente from './models/pacienteModel.js';
import Consulta from './models/consultaModel.js';
import Terminal from './domain/Terminal.js';
// Importando as associações
import './models/associations.js'; // Carrega as associações

async function inicializarBancoDeDados() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Sincronizar as tabelas com o banco
    await sequelize.sync({ alter: true }); // Pode ser 'force: true' se quiser recriar as tabelas
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
