import { DateTime } from 'luxon';

class Agendamento {
  constructor(cpfPaciente, dataConsulta, horaInicio, horaFim, pacientes, agendamentos) {
    this.cpfPaciente = cpfPaciente;
    this.dataConsulta = dataConsulta;
    this.horaInicio = horaInicio;
    this.horaFim = horaFim;
    this.pacientes = pacientes;
    this.agendamentos = agendamentos;
  }

  validarAgendamento() {
    return (
      this.validarCpf() &&
      this.validarDataConsulta() &&
      this.validarHoras() &&
      this.validarUnicoAgendamento() &&
      this.validarAgendamentoFuturo() &&
      this.validarHoraFinalMaiorQueHoraInicio() &&
      this.validarConsultorioAberto() &&
      this.validarSobreposicao()
    );
  }

  validarCpf() {
    return this.pacientes.some(paciente => paciente.cpf === this.cpfPaciente);
  }

  validarDataConsulta() {
    const dataValida = DateTime.fromFormat(this.dataConsulta, 'dd/MM/yyyy').isValid;
    return dataValida;
  }

  validarHoras() {
    const regexHora = /^(0[8-9]|1[0-9]):(00|15|30|45)$/;
    const horaInicioValida = regexHora.test(this.horaInicio);
    const horaFimValida = regexHora.test(this.horaFim);

    const horaInicioValidaIntervalo = DateTime.fromFormat(this.horaInicio, 'HHmm').hour >= 8 && DateTime.fromFormat(this.horaInicio, 'HHmm').hour < 19;
    const horaFimValidaIntervalo = DateTime.fromFormat(this.horaFim, 'HHmm').hour >= 8 && DateTime.fromFormat(this.horaFim, 'HHmm').hour < 19;

    return horaInicioValida && horaFimValida && horaInicioValidaIntervalo && horaFimValidaIntervalo;
  }

  validarAgendamentoFuturo() {
    const dataAtual = DateTime.now();
    const dataConsultaMoment = DateTime.fromFormat(this.dataConsulta, 'dd/MM/yyyy');
    const horaInicioMoment = DateTime.fromFormat(this.horaInicio, 'HHmm');
    const horaAtual = DateTime.now();

    if (dataConsultaMoment > dataAtual) {
      return true;
    } else if (dataConsultaMoment.equals(dataAtual) && horaInicioMoment > horaAtual) {
      return true;
    }
    return false;
  }

  validarHoraFinalMaiorQueHoraInicio() {
    const horaInicioMoment = DateTime.fromFormat(this.horaInicio, 'HHmm');
    const horaFimMoment = DateTime.fromFormat(this.horaFim, 'HHmm');
    return horaFimMoment > horaInicioMoment;
  }

  validarUnicoAgendamento() {
    return !this.agendamentos.some(agendamento => {
      return (
        agendamento.cpfPaciente === this.cpfPaciente &&
        DateTime.fromFormat(agendamento.dataConsulta, 'dd/MM/yyyy') > DateTime.now()
      );
    });
  }

  validarSobreposicao() {
    return !this.agendamentos.some(agendamento => {
      const agendamentoInicio = DateTime.fromFormat(`${agendamento.dataConsulta} ${agendamento.horaInicio}`, 'dd/MM/yyyy HHmm');
      const agendamentoFim = DateTime.fromFormat(`${agendamento.dataConsulta} ${agendamento.horaFim}`, 'dd/MM/yyyy HHmm');
      const novoInicio = DateTime.fromFormat(`${this.dataConsulta} ${this.horaInicio}`, 'dd/MM/yyyy HHmm');
      const novoFim = DateTime.fromFormat(`${this.dataConsulta} ${this.horaFim}`, 'dd/MM/yyyy HHmm');

      return (
        (novoInicio >= agendamentoInicio && novoInicio < agendamentoFim) ||
        (novoFim > agendamentoInicio && novoFim <= agendamentoFim) ||
        (agendamentoInicio >= novoInicio && agendamentoInicio < novoFim) ||
        (agendamentoFim > novoInicio && agendamentoFim <= novoFim)
      );
    });
  }

  validarConsultorioAberto() {
    const horarioInicio = DateTime.fromFormat('0800', 'HHmm');
    const horarioFim = DateTime.fromFormat('1900', 'HHmm');
    const horaInicioMoment = DateTime.fromFormat(this.horaInicio, 'HHmm');
    const horaFimMoment = DateTime.fromFormat(this.horaFim, 'HHmm');
    return horaInicioMoment >= horarioInicio && horaFimMoment <= horarioFim;
  }
}

export default Agendamento;
