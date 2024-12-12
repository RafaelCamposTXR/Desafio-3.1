import Paciente from '../models/PacienteModel.js';
import moment from 'moment'; // Importando o moment para validar as datas

class CadastroDePacientes {
  async adicionarPaciente(paciente) {
    try {
      // Verificando se a data foi recebida corretamente
      console.log("Data recebida: ", paciente.dataNascimento);

      // Validando a data de nascimento usando moment.js
      const dataValida = moment(paciente.dataNascimento, "DD/MM/YYYY", true);
      console.log("Data válida: ", dataValida.isValid());

      if (!dataValida.isValid()) {
        return { status: "erro", mensagem: "Data de nascimento inválida. Use o formato DD/MM/YYYY." };
      }

      // Criando o paciente no banco de dados
      const novoPaciente = await Paciente.create({
        nome: paciente.nome,
        cpf: paciente.cpf,
        dataNascimento: dataValida.format('YYYY-MM-DD'), // Formato aceito pelo banco
      });

      console.log("Paciente criado com sucesso: ", novoPaciente);

      return { status: "sucesso", mensagem: `Paciente ${novoPaciente.nome} adicionado com sucesso.` };
    } catch (erro) {
      // Logando o erro para verificar o motivo
      console.error("Erro ao adicionar paciente:", erro);

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
  
      // Retorne os dados corretamente
      return pacientes.map(paciente => ({
        nome: paciente.nome,
        cpf: paciente.cpf,
        dataNascimento: paciente.dataNascimento,
      }));
    } catch (erro) {
      // Retorne a mensagem de erro se ocorrer algum problema
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
