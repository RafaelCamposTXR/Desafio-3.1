class CadastroDePacientes {
  constructor() {
    this.pacientes = [];
    this.agendamentos = []; 
  }

  adicionarPaciente(paciente) {
    this.pacientes.push(paciente);
    console.log(`Paciente ${paciente.nome} adicionado com sucesso.`);
  }

  adicionarAgendamento(agendamento) {
    this.agendamentos.push(agendamento);
  }


  listarPacientes(ordem = 'cpf') {
    if (this.pacientes.length === 0) {
      console.log('Nenhum paciente cadastrado.');
      return;
    }

    const pacientesOrdenados = this.pacientes.sort((a, b) => {
      if (ordem === 'cpf') {
        return a.cpf.localeCompare(b.cpf);
      } else if (ordem === 'nome') {
        return a.nome.localeCompare(b.nome);
      }
      return 0;
    });

    pacientesOrdenados.forEach(paciente => {
      console.log(`Nome: ${paciente.nome}, CPF: ${paciente.cpf}, Nascimento: ${paciente.dataNascimento}`);

      const agendamentoFuturo = this.agendamentos.find(agendamento => 
        agendamento.cpfPaciente === paciente.cpf && DateTime.fromFormat(agendamento.dataConsulta, 'dd/MM/yyyy') > DateTime.now()
      );

      if (agendamentoFuturo) {
        console.log(`  Agendamento futuro: ${agendamentoFuturo.dataConsulta} ${agendamentoFuturo.horaInicio} - ${agendamentoFuturo.horaFim}`);
      }
    });
  }

  excluirPacientePorCPF(cpf) {
    const paciente = this.pacientes.find(p => p.cpf === cpf);
    if (!paciente) {
      console.log('Paciente não encontrado.');
      return;
    }

    try {
      const index = this.pacientes.indexOf(paciente);
      if (index > -1) {
        this.pacientes.splice(index, 1);
        console.log(`Paciente ${paciente.nome} excluído com sucesso.`);
      }
    } catch (error) {
      console.log(error.message); 
    }
  }
}
