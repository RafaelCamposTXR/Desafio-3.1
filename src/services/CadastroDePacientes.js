import Paciente from '../models/PacienteModel.js';
import Consulta from '../models/ConsultaModel.js';

class CadastroDePacientes {
  async adicionarPaciente(paciente) {
    try {
      const novoPaciente = await Paciente.create({
        nome: paciente.nome,
        cpf: paciente.cpf,
        dataNascimento: paciente.dataNascimento,
      });

      return { status: "sucesso", mensagem: `Paciente ${novoPaciente.nome} adicionado com sucesso.` };
    } catch (erro) {
      return { status: "erro", mensagem: erro.message };
    }
  }

  async listarPacientes(ordem = "cpf") {
    try {
      const pacientes = await Paciente.findAll({
        order: [
          [ordem, 'ASC'] 
        ]
      });

      if (pacientes.length === 0) {
        return { status: "vazio", mensagem: "Nenhum paciente cadastrado." };
      }

      return pacientes.map(paciente => ({
        nome: paciente.nome,
        cpf: paciente.cpf,
        dataNascimento: paciente.dataNascimento,
      }));
    } catch (erro) {
      return { status: "erro", mensagem: erro.message };
    }
  }

  async excluirPacientePorCPF(cpf) {
    try {
      const paciente = await Paciente.findOne({ where: { cpf } });
      if (!paciente) {
        return { status: "erro", mensagem: "Paciente não encontrado." };
      }

      await paciente.destroy();
      return { status: "sucesso", mensagem: `Paciente ${paciente.nome} excluído com sucesso.` };
    } catch (erro) {
      return { status: "erro", mensagem: erro.message };
    }
  }
}

export default CadastroDePacientes;
