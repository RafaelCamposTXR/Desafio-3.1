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
      return { sucesso: false, mensagem: `Paciente com CPF ${pacienteCpf} não encontrado.` };
    }

    try {
      // Cria uma nova consulta com os dados do paciente
      const consulta = new Consulta(paciente.nome, data, horaInicio, horaFim);

      // Valida a consulta antes de agendar
      consulta.validarHorario();
      consulta.validarData(new Date());

      // Adiciona o agendamento ao array de agendamentos
      this.agendamentos.push(consulta);
      return { sucesso: true, mensagem: `Consulta agendada com sucesso para o paciente ${paciente.nome}.`, consulta };
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message };
    }
  }

  // Método para excluir um agendamento
  excluirAgendamento(pacienteCpf, data) {
    const indice = this.agendamentos.findIndex(
      consulta => consulta.paciente === pacienteCpf && consulta.data === data
    );

    if (indice === -1) {
      return { sucesso: false, mensagem: 'Agendamento não encontrado.' };
    }

    const consultaRemovida = this.agendamentos.splice(indice, 1)[0];
    return { sucesso: true, mensagem: 'Consulta excluída com sucesso!', consulta: consultaRemovida };
  }

  // Método para listar todos os agendamentos
  listarAgenda() {
    if (this.agendamentos.length === 0) {
      return { sucesso: false, mensagem: 'Não há agendamentos.', agendamentos: [] };
    }

    return { sucesso: true, agendamentos: this.agendamentos };
  }

  // Método para listar agendamentos no período
  listarAgendaPorPeriodo(dataInicio, dataFim) {
    const agendamentosNoPeriodo = this.agendamentos.filter(consulta => {
      const dataConsulta = new Date(consulta.data.split('/').reverse().join('-'));
      return (
        dataConsulta >= new Date(dataInicio.split('/').reverse().join('-')) &&
        dataConsulta <= new Date(dataFim.split('/').reverse().join('-'))
      );
    });

    if (agendamentosNoPeriodo.length === 0) {
      return { sucesso: false, mensagem: 'Nenhum agendamento encontrado no período informado.', agendamentos: [] };
    }

    return { sucesso: true, agendamentos: agendamentosNoPeriodo };
  }

  // Método para listar agendamentos por CPF do paciente
  listarAgendamentoPorPaciente(pacienteCpf) {
    const agendamentosDoPaciente = this.agendamentos.filter(
      consulta => consulta.cpfPaciente === pacienteCpf
    );

    if (agendamentosDoPaciente.length === 0) {
      return { sucesso: false, mensagem: `Nenhum agendamento encontrado para o paciente com CPF ${pacienteCpf}.` };
    }

    return { sucesso: true, agendamentos: agendamentosDoPaciente };
  }
}

export default Agendamento;
