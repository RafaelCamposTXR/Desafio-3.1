class CadastroDePacientes {
  constructor() {
    this.pacientes = [];
  }

  adicionarPaciente(paciente) {
    this.pacientes.push(paciente);
    return { status: "sucesso", mensagem: `Paciente ${paciente.nome} adicionado com sucesso.` };
  }

  listarPacientes(ordem = "cpf") {
    if (this.pacientes.length === 0) {
      return { status: "vazio", mensagem: "Nenhum paciente cadastrado." };
    }

    const pacientesOrdenados = this.pacientes.sort((a, b) => {
      if (ordem === "cpf") {
        return a.cpf.localeCompare(b.cpf);
      } else if (ordem === "nome") {
        return a.nome.localeCompare(b.nome);
      }
      return 0;
    });

    return pacientesOrdenados.map(paciente => ({
      nome: paciente.nome,
      cpf: paciente.cpf,
      dataNascimento: paciente.dataNascimento,
    }));
  }

  excluirPacientePorCPF(cpf) {
    const paciente = this.pacientes.find(p => p.cpf === cpf);
    if (!paciente) {
      return { status: "erro", mensagem: "Paciente não encontrado." };
    }

    try {
      const index = this.pacientes.indexOf(paciente);
      if (index > -1) {
        this.pacientes.splice(index, 1);
        return { status: "sucesso", mensagem: `Paciente ${paciente.nome} excluído com sucesso.` };
      }
    } catch (error) {
      return { status: "erro", mensagem: error.message };
    }
  }
}

export default CadastroDePacientes;
