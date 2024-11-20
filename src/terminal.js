const readlineSync = require('readline-sync');

// Função para exibir o menu principal
function exibirMenuPrincipal() {
  console.clear();
  console.log('Menu Principal');
  console.log('1- Cadastro de pacientes');
  console.log('2- Agenda');
  console.log('3- Fim');

  const opcao = readlineSync.question('Escolha uma opção: ');

  switch (opcao) {
    case '1':
      exibirMenuCadastroPacientes();
      break;
    case '2':
      exibirMenuAgenda();
      break;
    case '3':
      console.log('Saindo...');
      process.exit();
    default:
      console.log('Opção inválida. Tente novamente.');
      exibirMenuPrincipal();
  }
}

// Função para exibir o menu de cadastro de pacientes
function exibirMenuCadastroPacientes() {
  console.clear();
  console.log('Menu do Cadastro de Pacientes');
  console.log('1- Cadastrar novo paciente');
  console.log('2- Excluir paciente');
  console.log('3- Listar pacientes (ordenado por CPF)');
  console.log('4- Listar pacientes (ordenado por nome)');
  console.log('5- Voltar p/ menu principal');

  const opcao = readlineSync.question('Escolha uma opção: ');

  switch (opcao) {
    case '1':
      cadastrarPaciente();
      break;
    case '2':
      excluirPaciente();
      break;
    case '3':
      listarPacientes('cpf');
      break;
    case '4':
      listarPacientes('nome');
      break;
    case '5':
      exibirMenuPrincipal();
      break;
    default:
      console.log('Opção inválida. Tente novamente.');
      exibirMenuCadastroPacientes();
  }
}

// Função para cadastrar um novo paciente
function cadastrarPaciente() {
  console.clear();
  console.log('Cadastro de Paciente');
  
  const cpf = readlineSync.question('Digite o CPF do paciente: ');
  const nome = readlineSync.question('Digite o nome do paciente: ');
  const dataNascimento = readlineSync.question('Digite a data de nascimento do paciente (dd/mm/aaaa): ');

  // Simulação de cadastro
  console.log(`CPF: ${cpf}`);
  console.log(`Nome: ${nome}`);
  console.log(`Data de nascimento: ${dataNascimento}`);
  console.log('Paciente cadastrado com sucesso!');
  
  exibirMenuCadastroPacientes();
}

// Função para excluir um paciente
function excluirPaciente() {
  console.clear();
  console.log('Excluir Paciente');
  
  const cpf = readlineSync.question('Digite o CPF do paciente a ser excluído: ');

  // Simulação de exclusão
  console.log(`Paciente com CPF: ${cpf} excluído com sucesso!`);
  
  exibirMenuCadastroPacientes();
}

// Função para listar pacientes
function listarPacientes(ordem) {
  console.clear();
  console.log('Listagem de Pacientes');
  console.log('------------------------------------------------------------');
  console.log('CPF Nome Dt.Nasc. Idade');
  console.log('------------------------------------------------------------');

  // Simulação de listagem de pacientes
  const pacientes = [
    { cpf: '99999999999', nome: 'Joao da Silva', dataNascimento: '01/01/1980', idade: 44 },
    { cpf: '12345678901', nome: 'Ana Souza', dataNascimento: '05/07/1995', idade: 29 },
  ];

  pacientes.sort((a, b) => {
    if (ordem === 'cpf') {
      return a.cpf.localeCompare(b.cpf);
    } else {
      return a.nome.localeCompare(b.nome);
    }
  });

  pacientes.forEach(paciente => {
    console.log(`${paciente.cpf} ${paciente.nome} ${paciente.dataNascimento} ${paciente.idade}`);
  });

  console.log('------------------------------------------------------------');
  exibirMenuCadastroPacientes();
}

// Função para exibir o menu de agenda
function exibirMenuAgenda() {
  console.clear();
  console.log('Agenda');
  console.log('1- Agendar consulta');
  console.log('2- Cancelar agendamento');
  console.log('3- Listar agenda');
  console.log('4- Voltar p/ menu principal');

  const opcao = readlineSync.question('Escolha uma opção: ');

  switch (opcao) {
    case '1':
      agendarConsulta();
      break;
    case '2':
      cancelarAgendamento();
      break;
    case '3':
      listarAgenda();
      break;
    case '4':
      exibirMenuPrincipal();
      break;
    default:
      console.log('Opção inválida. Tente novamente.');
      exibirMenuAgenda();
  }
}

// Função para agendar consulta
function agendarConsulta() {
  console.clear();
  console.log('Agendar Consulta');
  
  const cpf = readlineSync.question('Digite o CPF do paciente: ');
  const dataConsulta = readlineSync.question('Digite a data da consulta (dd/mm/aaaa): ');
  const horaInicio = readlineSync.question('Digite a hora de início (hh:mm): ');
  const horaFim = readlineSync.question('Digite a hora de término (hh:mm): ');

  // Simulação de agendamento
  console.log(`Consulta agendada para o paciente com CPF: ${cpf}`);
  console.log(`Data: ${dataConsulta}, Hora: ${horaInicio} - ${horaFim}`);
  
  exibirMenuAgenda();
}

// Função para cancelar agendamento
function cancelarAgendamento() {
  console.clear();
  console.log('Cancelar Agendamento');
  
  const cpf = readlineSync.question('Digite o CPF do paciente: ');
  const dataConsulta = readlineSync.question('Digite a data da consulta a ser cancelada (dd/mm/aaaa): ');

  // Simulação de cancelamento
  console.log(`Agendamento de consulta para o paciente com CPF: ${cpf} na data ${dataConsulta} cancelado com sucesso!`);
  
  exibirMenuAgenda();
}

// Função para listar a agenda
function listarAgenda() {
  console.clear();
  console.log('Listagem de Agenda');
  console.log('Apresentar a agenda T-Toda ou P-Periodo: P');
  console.log('Data inicial: 01/01/2022');
  console.log('Data final: 05/01/2022');
  console.log('-------------------------------------------------------------');
  console.log('Data H.Ini H.Fim Tempo Nome Dt.Nasc.');
  console.log('-------------------------------------------------------------');

  // Simulação de agenda
  const agenda = [
    { data: '01/01/2022', horaInicio: '07:30', horaFim: '08:00', tempo: '00:30', nome: 'Joao da Silva', nascimento: '01/01/1980' },
    { data: '01/01/2022', horaInicio: '08:15', horaFim: '09:00', tempo: '00:45', nome: 'Ana Souza', nascimento: '05/07/1995' },
  ];

  agenda.forEach(item => {
    console.log(`${item.data} ${item.horaInicio} ${item.horaFim} ${item.tempo} ${item.nome} ${item.nascimento}`);
  });

  console.log('-------------------------------------------------------------');
  exibirMenuAgenda();
}

// Inicia o menu principal
exibirMenuPrincipal();
