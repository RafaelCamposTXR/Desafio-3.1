import { DateTime } from 'luxon';

class Consulta {
  constructor(paciente, data, horaInicio, horaFim) {
    this.paciente = paciente;


    // Usando Luxon para criar os objetos DateTime apenas com horas e minutos
    this.horaInicio = this.criarHora(horaInicio);
    this.horaFim = this.criarHora(horaFim);

    this.data = DateTime.fromFormat(data, "dd/MM/yy");
    if (!this.data.isValid) {
      throw new Error("Data inválida. O formato deve ser DD/MM/YY.");
    }
  }

  // Função para criar um objeto DateTime apenas com a hora e minuto
  criarHora(hora) {
    // Cria um objeto DateTime com as horas e minutos, mas sem considerar a data
    return DateTime.fromFormat(hora, 'HH:mm');
  }

  // Verifica se o horário é válido
  validarHorario() {
    // Verifica se o início e o fim são múltiplos de 15 minutos
    const minutosValidos = (hora) => hora.minute % 15 === 0;

    if (!minutosValidos(this.horaInicio) || !minutosValidos(this.horaFim)) {
      throw new Error("Horários inválidos. As horas devem ser múltiplos de 15 minutos.");
    }

    // Considerando apenas as horas e minutos, sem o dia
    const horarioConsultorioInicio = DateTime.fromObject({ hour: 8, minute: 0 }); 
    const horarioConsultorioFim = DateTime.fromObject({ hour: 19, minute: 0 }); 

    // Verifica se a consulta está dentro do horário de funcionamento
    if (this.horaInicio < horarioConsultorioInicio || this.horaFim > horarioConsultorioFim) {
      throw new Error("Horário fora do período de funcionamento do consultório (08:00 - 19:00).");
    }

    if (this.horaInicio >= this.horaFim) {
      throw new Error("Hora final não pode ser antes da hora inicial.");
    }
  }

  // Verifica se a consulta é para o futuro
  isFuturo(agora) {
    console.log(agora);
    const agoraDateTime = DateTime.fromISO(agora, { setZone: true });
    console.log(agoraDateTime);
    console.log(this.data);


    if (this.data > agoraDateTime) {
        return true;
    }

    if (this.data.hasSame(agoraDateTime, "day")) {
        const horaAtual = agoraDateTime.toObject();
        const horaInicioConsulta = this.horaInicio.toObject();

        if (
            horaInicioConsulta.hour > horaAtual.hour ||
            (horaInicioConsulta.hour === horaAtual.hour &&
                horaInicioConsulta.minute > horaAtual.minute)
        ) {
            return true;
        }
    }

    return false;
}


  validarData(agora) {
    if (!this.isFuturo(agora)) {
      throw new Error("A consulta deve ser agendada para um horário futuro.");
    }
  }
}

export default Consulta;
