import inquirer from 'inquirer'; 
import CadastroDePacientes from '../services/CadastroDePacientes.js';
import Agendamentos from '../services/agendamento.js';
import { DateTime } from 'luxon';

class Terminal {
  constructor() {
    this.cadastroDePacientes = new CadastroDePacientes();
    this.agendamentos = new Agendamentos(this.cadastroDePacientes);
  }

  async exibirMenuPrincipal() {
    let opcao = '';
    do {
      console.log('\nMenu Principal');
      console.log('1 - Cadastro de Pacientes');
      console.log('2 - Agenda');
      console.log('3 - Fim');
      
      const resposta = await inquirer.prompt({
        type: 'input',
        name: 'opcao',
        message: 'Escolha uma opção: ',
      });

      opcao = resposta.opcao;

      switch (opcao) {
        case '1':
          await this.menuCadastroDePacientes();
          break;
        case '2':
          await this.menuAgenda();
          break;
        case '3':
          console.log('Encerrando o sistema.');
          break;
        default:
          console.log('Opção inválida. Tente novamente.');
      }
    } while (opcao !== '3');
  }

  async menuCadastroDePacientes() {
    let opcao = '';
    do {
      console.log('\nMenu do Cadastro de Pacientes');
      console.log('1 - Cadastrar novo paciente');
      console.log('2 - Excluir paciente');
      console.log('3 - Listar pacientes (ordenado por CPF)');
      console.log('4 - Listar pacientes (ordenado por nome)');
      console.log('5 - Voltar p/ menu principal');
      
      const resposta = await inquirer.prompt({
        type: 'input',
        name: 'opcao',
        message: 'Escolha uma opção: ',
      });

      opcao = resposta.opcao;

      switch (opcao) {
        case '1':
          await this.cadastrarPaciente();
          break;
        case '2':
          await this.excluirPaciente();
          break;
        case '3':
          await this.listarPacientes('cpf');
          break;
        case '4':
          await this.listarPacientes('nome');
          break;
        case '5':
          console.log('Voltando ao menu principal.');
          break;
        default:
          console.log('Opção inválida. Tente novamente.');
      }
    } while (opcao !== '5');
  }

  async menuAgenda() {
    let opcao = '';
    do {
      console.log('\nAgenda');
      console.log('1 - Agendar consulta');
      console.log('2 - Cancelar agendamento');
      console.log('3 - Listar agenda');
      console.log('4 - Voltar p/ menu principal');
      
      const resposta = await inquirer.prompt({
        type: 'input',
        name: 'opcao',
        message: 'Escolha uma opção: ',
      });

      opcao = resposta.opcao;

      switch (opcao) {
        case '1':
          await this.agendarConsulta();
          break;
        case '2':
          await this.cancelarAgendamento();
          break;
        case '3':
          await this.listarAgenda();
          break;
        case '4':
          console.log('Voltando ao menu principal.');
          break;
        default:
          console.log('Opção inválida. Tente novamente.');
      }
    } while (opcao !== '4');
  }

  async cadastrarPaciente() {
    const respostas = await inquirer.prompt([
      {
        type: 'input',
        name: 'cpf',
        message: 'CPF: ',
      },
      {
        type: 'input',
        name: 'nome',
        message: 'Nome: ',
      },
      {
        type: 'input',
        name: 'dataNascimento',
        message: 'Data de nascimento (DD/MM/YYYY): ',
      },
    ]);

    const resultado = this.cadastroDePacientes.adicionarPaciente(respostas);
    console.log(resultado.mensagem);
  }

  async excluirPaciente() {
    const resposta = await inquirer.prompt({
      type: 'input',
      name: 'cpf',
      message: 'CPF do paciente a ser excluído: ',
    });

    const resultado = this.cadastroDePacientes.excluirPacientePorCPF(resposta.cpf);
    console.log(resultado.mensagem);
  }

  async listarPacientes(ordem) {
    const resultado = await this.cadastroDePacientes.listarPacientes(ordem);

    if (Array.isArray(resultado)) {
      if (resultado.length === 0) {
        console.log("Nenhum paciente encontrado.");
      } else {
        console.log("------------------------------------------------------------");
        console.log("CPF             Nome                         Dt.Nasc.  Idade");
        console.log("------------------------------------------------------------");

        resultado.forEach(paciente => {
          const idade = this.calcularIdade(paciente.dataNascimento);
          const nomeFormatado = paciente.nome.padEnd(30, " ");
          console.log(
            `${paciente.cpf} ${nomeFormatado} ${paciente.dataNascimento} ${idade.toString().padStart(3, " ")}`
          );

          const agendamento = this.agendamentos.listarAgendamentoPorPaciente(paciente.cpf);
          if (agendamento.sucesso) {
            console.log(`\nAgendado para: ${agendamento.agendamentos.data}`);
            console.log(`${agendamento.agendamentos.horaInicio} às ${agendamento.agendamentos.horaFim}\n`);
          }
        });

        console.log("------------------------------------------------------------");
      }
    } else {
      console.log(resultado.mensagem); // Exibe a mensagem de erro ou de vazio
    }
  }

  calcularIdade(dataNascimento) {
    const [dia, mes, ano] = dataNascimento.split('/').map(Number);
    const hoje = new Date();
    const aniversario = new Date(ano, mes - 1, dia);

    let idade = hoje.getFullYear() - aniversario.getFullYear();
    if (hoje < new Date(hoje.getFullYear(), aniversario.getMonth(), aniversario.getDate())) {
      idade--;
    }

    return idade;
  }

  async agendarConsulta() {
    const respostas = await inquirer.prompt([
      {
        type: 'input',
        name: 'cpfPaciente',
        message: 'CPF do paciente: ',
      },
      {
        type: 'input',
        name: 'dataConsulta',
        message: 'Data da consulta (DD/MM/YYYY): ',
      },
      {
        type: 'input',
        name: 'horaInicio',
        message: 'Hora de início (HH:MM): ',
      },
      {
        type: 'input',
        name: 'horaFim',
        message: 'Hora de término (HH:MM): ',
      },
    ]);

    const resultado = this.agendamentos.agendarConsulta(respostas.cpfPaciente, respostas.dataConsulta, respostas.horaInicio, respostas.horaFim);
    console.log(resultado.mensagem);
  }

  async cancelarAgendamento() {
    const resposta = await inquirer.prompt([
      {
        type: 'input',
        name: 'cpfPaciente',
        message: 'CPF do paciente: ',
      },
      {
        type: 'input',
        name: 'dataConsulta',
        message: 'Data da consulta a ser cancelada (DD/MM/YYYY): ',
      },
    ]);

    const resultado = this.agendamentos.excluirAgendamento(resposta.cpfPaciente, resposta.dataConsulta);
    console.log(resultado.mensagem);
  }

  async listarAgenda() {
    const resposta = await inquirer.prompt([
      {
        type: 'input',
        name: 'opcao',
        message: 'Apresentar agenda T-Toda ou P-Período: ',
      }
    ]);

    if (resposta.opcao.toUpperCase() === 'T') {
      const resultado = this.agendamentos.listarAgenda();
      if (resultado.status === 'vazio') {
        console.log(resultado.mensagem);
      } else {
        resultado.agendamentos.forEach(consulta => {
          console.log(
            `Paciente: ${consulta.paciente}, Data: ${consulta.data}, Horário: ${consulta.horaInicio} - ${consulta.horaFim}`
          );
        });
      }
    } else if (resposta.opcao.toUpperCase() === 'P') {
      const periodo = await inquirer.prompt([
        {
          type: 'input',
          name: 'dataInicio',
          message: 'Data inicial (DD/MM/YYYY): ',
        },
        {
          type: 'input',
          name: 'dataFim',
          message: 'Data final (DD/MM/YYYY): ',
        }
      ]);

      const resultado = this.agendamentos.listarAgendaPorPeriodo(periodo.dataInicio, periodo.dataFim);
      if (resultado.status === 'vazio') {
        console.log(resultado.mensagem);
      } else {
        console.log("-------------------------------------------------------------");
        console.log("Data       H.Ini   H.Fim   Tempo  Nome                      Dt.Nasc.");
        console.log("-------------------------------------------------------------");

        resultado.agendamentos.forEach(consulta => {
          const { data, horaInicio, horaFim, paciente, nome, dataNascimento } = consulta;
          const tempoConsulta = this.calcularTempo(horaInicio, horaFim);
          const nomeFormatado = paciente.padEnd(25, " ");
          console.log(
            `${data.toFormat('dd/MM/yy')} ${horaInicio.toFormat('HH:mm')} ${horaFim.toFormat('HH:mm')} ${tempoConsulta} ${nomeFormatado} ${dataNascimento}`
          );
        });

        console.log("-------------------------------------------------------------");
      }
    } else {
      console.log('Opção inválida.');
    }
  }

  calcularTempo(horaInicio, horaFim) {
    const inicio = DateTime.fromISO(horaInicio);  
    const fim = DateTime.fromISO(horaFim);  

    const duracao = fim.diff(inicio, 'minutes').minutes;

    const horas = Math.floor(duracao / 60);
    const minutos = duracao % 60;

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  }
}

export default Terminal;
