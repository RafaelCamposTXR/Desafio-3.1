import { Paciente } from '../database/models'; // Importando o model Paciente do Sequelize

class CadastroDePacientes {
  async adicionarPaciente(paciente) {
    try {
      // Cria o paciente no banco de dados
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
      // Busca os pacientes no banco de dados, ordenados conforme solicitado
      const pacientes = await Paciente.findAll({
        order: [
          [ordem, 'ASC'] // Ordena por "cpf" ou "nome", dependendo do parâmetro
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
      // Busca o paciente no banco de dados pelo CPF
      const paciente = await Paciente.findOne({ where: { cpf } });
      if (!paciente) {
        return { status: "erro", mensagem: "Paciente não encontrado." };
      }

      // Exclui o paciente do banco de dados
      await paciente.destroy();
      return { status: "sucesso", mensagem: `Paciente ${paciente.nome} excluído com sucesso.` };
    } catch (erro) {
      return { status: "erro", mensagem: erro.message };
    }
  }
}

export default CadastroDePacientes;
