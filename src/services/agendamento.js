import Paciente from '../models/pacienteModel.js';
import Consulta from '../models/consultaModel.js';

import { DateTime } from "luxon";

class Agendamento {
  async agendarConsulta(pacienteCpf, data, horaInicio, horaFim) {
    // Buscar paciente pelo CPF
    const paciente = await Paciente.findOne({ where: { cpf: pacienteCpf } });
    if (!paciente) {
      return { sucesso: false, mensagem: `Paciente com CPF ${pacienteCpf} não encontrado.` };
    }
  
    try {
      // Converter a data e hora usando Luxon
      const horaInicioObj = DateTime.fromFormat(horaInicio, 'HH:mm');
      const horaFimObj = DateTime.fromFormat(horaFim, 'HH:mm');
      const dataObj = DateTime.fromFormat(data, 'dd/MM/yyyy');
  
      // Verificar se as conversões são válidas
      if (!horaInicioObj.isValid || !horaFimObj.isValid || !dataObj.isValid) {
        throw new Error('Data ou horário inválido.');
      }
  
      // Criar as instâncias Date do JavaScript a partir dos objetos DateTime do Luxon
      const horaInicioDate = horaInicioObj.set({ second: 0 }).toJSDate();  // Garantir segundos como 0
      const horaFimDate = horaFimObj.set({ second: 0 }).toJSDate();  // Garantir segundos como 0
      const dataDate = dataObj.toJSDate();  // Converte para objeto Date
  
      // Log para inspecionar os valores antes de criar a consulta
      console.log({
        pacienteId: paciente.id,
        data: dataDate,
        horaInicio: horaInicioDate,
        horaFim: horaFimDate,
      });
  
      // Criar a consulta
      const consulta = await Consulta.create({
        pacienteId: paciente.id,
        data: dataDate,  // Agora passando o formato Date
        horaInicio: horaInicioDate,  // Agora passando o formato Date com segundos ajustados
        horaFim: horaFimDate,  // Agora passando o formato Date com segundos ajustados
      });
  
      return { sucesso: true, mensagem: `Consulta agendada com sucesso para o paciente ${paciente.nome}.`, consulta };
    } catch (erro) {
      // Log do erro para diagnóstico
      console.error(erro);
      return { sucesso: false, mensagem: erro.message };
    }
  }
  

  async excluirAgendamento(pacienteCpf, data) {
    const paciente = await Paciente.findOne({ where: { cpf: pacienteCpf } });
    if (!paciente) {
      return { sucesso: false, mensagem: 'Paciente não encontrado.' };
    }

    const consulta = await Consulta.findOne({
      where: { pacienteId: paciente.id, data: DateTime.fromFormat(data, 'dd/MM/yyyy').toJSDate() },
    });

    if (!consulta) {
      return { sucesso: false, mensagem: 'Agendamento não encontrado.' };
    }

    await consulta.destroy();
    return { sucesso: true, mensagem: 'Consulta excluída com sucesso!', consulta };
  }

  async listarAgenda() {
    const agendamentos = await Consulta.findAll({
      include: [
        {
          model: Paciente,
          as: 'paciente', 
          attributes: ['nome', 'cpf']
        }
      ]
    });
  
    if (agendamentos.length === 0) {
      return { sucesso: false, mensagem: 'Não há agendamentos.', agendamentos: [] };
    }
  
    return { sucesso: true, agendamentos };
  }

  async listarAgendaPorPeriodo(dataInicio, dataFim) {
    const agendamentos = await Consulta.findAll({
      where: {
        data: {
          $gte: DateTime.fromFormat(dataInicio, 'dd/MM/yyyy').toJSDate(),
          $lte: DateTime.fromFormat(dataFim, 'dd/MM/yyyy').toJSDate(),
        },
      },
      include: { model: Paciente, attributes: ['nome', 'cpf'] },
    });

    if (agendamentos.length === 0) {
      return { sucesso: false, mensagem: 'Nenhum agendamento encontrado no período informado.', agendamentos: [] };
    }

    return { sucesso: true, agendamentos };
  }

  async listarAgendamentoPorPaciente(pacienteCpf) {
    const paciente = await Paciente.findOne({ where: { cpf: pacienteCpf } });
    if (!paciente) {
      return { sucesso: false, mensagem: 'Paciente não encontrado.' };
    }

    const agendamentos = await Consulta.findAll({ where: { pacienteId: paciente.id } });

    if (agendamentos.length === 0) {
      return { sucesso: false, mensagem: `Nenhum agendamento encontrado para o paciente com CPF ${pacienteCpf}.` };
    }

    return { sucesso: true, agendamentos };
  }
}

export default Agendamento;
