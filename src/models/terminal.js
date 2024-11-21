import promptSync from 'prompt-sync'; 
import CadastroDePacientes from './CadastroDePacientes.js';
import Agendamentos from './agendamento.js';

const prompt = promptSync();

class Terminal {
  constructor() {
    this.cadastroDePacientes = new CadastroDePacientes();
    this.agendamentos = new Agendamentos(this.cadastroDePacientes);
  }

  exibirMenuPrincipal() {
    let opcao = '';
    do {
      console.log('\nMenu Principal');
      console.log('1 - Cadastro de Pacientes');
      console.log('2 - Agenda');
      console.log('3 - Fim');
      opcao = prompt('Escolha uma opção: ');

      switch (opcao) {
        case '1':
          this.menuCadastroDePacientes();
          break;
        case '2':
          this.menuAgenda();
          break;
        case '3':
          console.log('Encerrando o sistema.');
          break;
        default:
          console.log('Opção inválida. Tente novamente.');
      }
    } while (opcao !== '3');
  }

  menuCadastroDePacientes() {
    let opcao = '';
    do {
      console.log('\nMenu do Cadastro de Pacientes');
      console.log('1 - Cadastrar novo paciente');
      console.log('2 - Excluir paciente');
      console.log('3 - Listar pacientes (ordenado por CPF)');
      console.log('4 - Listar pacientes (ordenado por nome)');
      console.log('5 - Voltar p/ menu principal');
      opcao = prompt('Escolha uma opção: ');

      switch (opcao) {
        case '1':
          this.cadastrarPaciente();
          break;
        case '2':
          this.excluirPaciente();
          break;
        case '3':
          this.listarPacientes('cpf');
          break;
        case '4':
          this.listarPacientes('nome');
          break;
        case '5':
          console.log('Voltando ao menu principal.');
          break;
        default:
          console.log('Opção inválida. Tente novamente.');
      }
    } while (opcao !== '5');
  }

  menuAgenda() {
    let opcao = '';
    do {
      console.log('\nAgenda');
      console.log('1 - Agendar consulta');
      console.log('2 - Cancelar agendamento');
      console.log('3 - Listar agenda');
      console.log('4 - Voltar p/ menu principal');
      opcao = prompt('Escolha uma opção: ');

      switch (opcao) {
        case '1':
          this.agendarConsulta();
          break;
        case '2':
          this.cancelarAgendamento();
          break;
        case '3':
          this.listarAgenda();
          break;
        case '4':
          console.log('Voltando ao menu principal.');
          break;
        default:
          console.log('Opção inválida. Tente novamente.');
      }
    } while (opcao !== '4');
  }

  cadastrarPaciente() {
    const cpf = prompt('CPF: ');
    const nome = prompt('Nome: ');
    const dataNascimento = prompt('Data de nascimento (DD/MM/YYYY): ');

    if (this.cadastroDePacientes.pacientes.some(p => p.cpf === cpf)) {
      console.log('Erro: CPF já cadastrado.');
    } else {
      this.cadastroDePacientes.adicionarPaciente({ cpf, nome, dataNascimento });
    }
  }

  excluirPaciente() {
    const cpf = prompt('CPF do paciente a ser excluído: ');
    this.cadastroDePacientes.excluirPacientePorCPF(cpf);
  }

  listarPacientes(ordem) {
    this.cadastroDePacientes.listarPacientes(ordem);
  }

  agendarConsulta() {
    const cpfPaciente = prompt('CPF do paciente: ');
    const dataConsulta = prompt('Data da consulta (DD/MM/YYYY): ');
    const horaInicio = prompt('Hora de início (HH:MM): ');
    const horaFim = prompt('Hora de término (HH:MM): ');

    if (!this.cadastroDePacientes.pacientes.some(p => p.cpf === cpfPaciente)) {
      console.log('Erro: Paciente não encontrado.');
    } else {
      const agendamento = {
        cpfPaciente,
        dataConsulta,
        horaInicio,
        horaFim
      };

      this.agendamentos.agendarConsulta(cpfPaciente, dataConsulta, horaInicio, horaFim);  
      console.log('Consulta agendada com sucesso!');
    }
  }

  cancelarAgendamento() {
    const cpfPaciente = prompt('CPF do paciente: ');
    const dataConsulta = prompt('Data da consulta a ser cancelada (DD/MM/YYYY): ');

    agendamento.excluirAgendamento(cpfPaciente, dataConsulta);
  }

  listarAgenda() {
    const opcao = prompt('Apresentar agenda T-Toda ou P-Período: ').toUpperCase();
    if (opcao === 'T') {
      console.log('Agenda completa:');
      this.agendamentos.listarAgenda();
    } else if (opcao === 'P') {
      const dataInicio = prompt('Data inicial (DD/MM/YYYY): ');
      const dataFim = prompt('Data final (DD/MM/YYYY): ');

      console.log('Agenda no período:');
      this.agendamentos.agendamentos
        .filter(agendamento => agendamento.dataConsulta >= dataInicio && agendamento.dataConsulta <= dataFim)
        .forEach(agendamento => {
          console.log(
            `Data: ${agendamento.dataConsulta}, Horário: ${agendamento.horaInicio} - ${agendamento.horaFim}, CPF: ${agendamento.cpfPaciente}`
          );
        });
    } else {
      console.log('Opção inválida.');
    }
  }
}

export default Terminal;
