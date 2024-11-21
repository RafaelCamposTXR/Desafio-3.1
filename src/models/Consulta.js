class Consulta {
  constructor(paciente, data, horaInicio, horaFim) {
    this.paciente = paciente;
    this.data = data; 
    this.minutosInicio = this.converteParaMinutos(horaInicio);  // Convertendo a hora para minutos
    this.minutosFim = this.converteParaMinutos(horaFim);        // Convertendo a hora para minutos
  }

  // Função para converter a hora 'hh:mm' para minutos desde a meia-noite
  converteParaMinutos(hora) {
    const [horas, minutos] = hora.split(":").map(Number);
    return horas * 60 + minutos; // Converte para minutos desde 00:00
  }

  // Verifica se o horário é válido
  validarHorario() {
    // Verifica se o início e o fim são múltiplos de 15 minutos
    const minutosValidos = (minutos) => minutos % 15 === 0;
    if (!minutosValidos(this.minutosInicio) || !minutosValidos(this.minutosFim)) {
      throw new Error("Horários inválidos. As horas devem ser múltiplos de 15 minutos.");
    }

    const horarioConsultorioInicio = 480; // 08:00 em minutos (480 minutos)
    const horarioConsultorioFim = 1140;  // 19:00 em minutos (1140 minutos)
    if (this.minutosInicio < horarioConsultorioInicio || this.minutosFim > horarioConsultorioFim) {
      throw new Error("Horário fora do período de funcionamento do consultório (08:00 - 19:00).");
    }

    if (this.minutosInicio >= this.minutosFim) {
      throw new Error("Hora final não pode ser antes da hora inicial.");
    }
  }

  // Verifica se a consulta é para o futuro
  isFuturo(agora) {
    const dataConsulta = new Date(this.data.split("/").reverse().join("-"));
    console.log(dataConsulta);
    const horas = Math.floor(this.minutosInicio / 60);
    const minutos = this.minutosInicio % 60;
    dataConsulta.setHours(horas);
    dataConsulta.setMinutes(minutos);

    return dataConsulta > agora;
  }

  // Valida se a consulta é para um horário futuro
  validarData(agora) {
    if (!this.isFuturo(agora)) {
      throw new Error("A consulta deve ser agendada para um horário futuro.");
    }
  }
}

export default Consulta;
