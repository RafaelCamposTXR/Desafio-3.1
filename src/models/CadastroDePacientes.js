class CadastroDePacientes {
  constructor() {
    this.pacientes = []; 
  }


  adicionarPaciente(paciente) {
    this.pacientes.push(paciente);
    console.log(`Paciente ${paciente.nome} adicionado com sucesso.`);
  }


  listarPacientes() {
    if (this.pacientes.length === 0) {
      console.log('Nenhum paciente cadastrado.');
    } else {
      this.pacientes.forEach(paciente => {
        console.log(`Nome: ${paciente.nome}, CPF: ${paciente.cpf}, Nascimento: ${paciente.dataNascimento}`);
      });
    }
  }

  excluirPacientePorCPF(cpf) {
    const paciente = this.pacientes.find(p => p.cpf === cpf);
    if (!paciente) {
      console.log('Paciente não encontrado.');
      return;
    }

    try {
      paciente.excluirPaciente();  
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
