import Paciente from '../models/pacienteModel.js';
import Consulta from '../models/consultaModel.js';

import { DateTime } from "luxon";

class Agendamento {
  async agendarConsulta(pacienteCpf, data, horaInicio, horaFim) {
    const paciente = await Paciente.findOne({ where: { cpf: pacienteCpf } });
    if (!paciente) {
      return { sucesso: false, mensagem: `Paciente com CPF ${pacienteCpf} não encontrado.` };
    }
  
    try {
      const horaInicioObj = DateTime.fromFormat(horaInicio, 'HH:mm');
      const horaFimObj = DateTime.fromFormat(horaFim, 'HH:mm');
      const dataObj = DateTime.fromFormat(data, 'dd/MM/yyyy');
  
      if (!horaInicioObj.isValid || !horaFimObj.isValid || !dataObj.isValid) {
        throw new Error('Data ou horário inválido.');
      }
  
      const horaInicioStr = horaInicioObj.toFormat('HH:mm');  
      const horaFimStr = horaFimObj.toFormat('HH:mm');  
      const dataDate = dataObj.toJSDate(); 

  

      const consulta = await Consulta.create({
        pacienteId: paciente.id,
        data: dataDate,  
        horaInicio: horaInicioStr,  
        horaFim: horaFimStr,  
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
