import CadastroDePacientes from './CadastroDePacientes.js'; // Importando a classe CadastroDePacientes
import Consulta from './Consulta.js';


class Agendamento {
  constructor(cadastroDePacientes) {
    if (!(cadastroDePacientes instanceof CadastroDePacientes)) {
      throw new Error('É necessário passar uma instância de CadastroDePacientes.');
    }
    this.agendamentos = [];
    this.cadastroDePacientes = cadastroDePacientes;
  }

  // Método para agendar uma nova consulta
  agendarConsulta(pacienteCpf, data, horaInicio, horaFim) {
    // Verifica se o paciente está cadastrado
    const paciente = this.cadastroDePacientes.pacientes.find(p => p.cpf === pacienteCpf);
    if (!paciente) {
      throw new Error(`Paciente com CPF ${pacienteCpf} não encontrado.`);
    }

    // Cria uma nova consulta com os dados do paciente
    const consulta = new Consulta(paciente.nome, data, horaInicio, horaFim);

    // Valida a consulta antes de agendar
    consulta.validarHorario();
    const agora = new Date();
    console.log(agora);
    consulta.validarData(agora);

    // Adiciona o agendamento ao array de agendamentos
    console.log(consulta);
    this.agendamentos.push(consulta);
    console.log(`Consulta agendada com sucesso para o paciente ${paciente.nome}!`);
  }

  // Método para excluir um agendamento
  excluirAgendamento(pacienteCpf, data) {
    const indice = this.agendamentos.findIndex(consulta => consulta.paciente === pacienteCpf && consulta.data === data);
    
    if (indice === -1) {
      throw new Error("Agendamento não encontrado.");
    }

    this.agendamentos.splice(indice, 1);
    console.log("Consulta excluída com sucesso!");
  }

  // Método para listar todos os agendamentos
  listarAgenda() {
    if (this.agendamentos.length === 0) {
      console.log("Não há agendamentos.");
      return;
    }

    this.agendamentos.forEach(consulta => {
      console.log(consulta)
      console.log(
        `Paciente: ${consulta.paciente}, Data: ${consulta.data}, Horário: ${consulta.horaInicio} - ${consulta.horaFim}`
      );
    });
  }

  // Método para listar agendamentos no período
  listarAgendaPorPeriodo(dataInicio, dataFim) {
    const agendamentosNoPeriodo = this.agendamentos.filter(consulta => {
      const dataConsulta = new Date(consulta.data.split("/").reverse().join("-"));
      return dataConsulta >= new Date(dataInicio.split("/").reverse().join("-")) && dataConsulta <= new Date(dataFim.split("/").reverse().join("-"));
    });

    if (agendamentosNoPeriodo.length === 0) {
      console.log("Nenhum agendamento encontrado no período informado.");
      return;
    }

    agendamentosNoPeriodo.forEach(consulta => {
      console.log(
        `Paciente: ${consulta.paciente}, Data: ${consulta.data}, Horário: ${consulta.horaInicio} - ${consulta.horaFim}`
      );
    });
  }
}


export default Agendamento;
