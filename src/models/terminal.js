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

    const resultado = this.cadastroDePacientes.adicionarPaciente({ cpf, nome, dataNascimento });
    console.log(resultado.mensagem);
  }

  excluirPaciente() {
    const cpf = prompt('CPF do paciente a ser excluído: ');
    const resultado = this.cadastroDePacientes.excluirPacientePorCPF(cpf);
    console.log(resultado.mensagem);
  }

  listarPacientes(ordem) {
    const resultado = this.cadastroDePacientes.listarPacientes(ordem);
    
    if (resultado.status === 'vazio') {
      console.log(resultado.mensagem);
    } else {
      console.log("------------------------------------------------------------");
      console.log("CPF             Nome                           Dt.Nasc.  Idade");
      console.log("------------------------------------------------------------");
  
      resultado.forEach(paciente => {
        const idade = this.calcularIdade(paciente.dataNascimento);
        const nomeFormatado = paciente.nome.padEnd(30, " ");
        console.log(
          `${paciente.cpf} ${nomeFormatado} ${paciente.dataNascimento} ${idade.toString().padStart(3, " ")}`
        );
  
        // Exemplo fictício de agendamento; pode ser adaptado ao método correto
        const agendamento = this.agendamentos.listarAgendamentoPorPaciente(paciente.cpf);
        if (agendamento.sucesso) {
          console.log(`\nAgendado para: ${agendamento.agendamentos.data}`);
          console.log(`${agendamento.agendamentos.horaInicio} às ${agendamento.agendamentos.horaFim}\n`);
        }
      });
  
      console.log("------------------------------------------------------------");
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
  

  agendarConsulta() {
    const cpfPaciente = prompt('CPF do paciente: ');
    const dataConsulta = prompt('Data da consulta (DD/MM/YYYY): ');
    const horaInicio = prompt('Hora de início (HH:MM): ');
    const horaFim = prompt('Hora de término (HH:MM): ');

    const resultado = this.agendamentos.agendarConsulta(cpfPaciente, dataConsulta, horaInicio, horaFim);
    console.log(resultado.mensagem);
  }

  cancelarAgendamento() {
    const cpfPaciente = prompt('CPF do paciente: ');
    const dataConsulta = prompt('Data da consulta a ser cancelada (DD/MM/YYYY): ');

    const resultado = this.agendamentos.excluirAgendamento(cpfPaciente, dataConsulta);
    console.log(resultado.mensagem);
  }

  listarAgenda() {
    const opcao = prompt('Apresentar agenda T-Toda ou P-Período: ').toUpperCase();
    if (opcao === 'T') {
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
    } else if (opcao === 'P') {
      const dataInicio = prompt('Data inicial (DD/MM/YYYY): ');
      const dataFim = prompt('Data final (DD/MM/YYYY): ');

      const resultado = this.agendamentos.listarAgendaPorPeriodo(dataInicio, dataFim);
      if (resultado.status === 'vazio') {
        console.log(resultado.mensagem);
      } else {
        resultado.agendamentos.forEach(consulta => {
          console.log(
            `Paciente: ${consulta.paciente}, Data: ${consulta.data}, Horário: ${consulta.horaInicio} - ${consulta.horaFim}`
          );
        });
      }
    } else {
      console.log('Opção inválida.');
    }
  }
}

export default Terminal;
