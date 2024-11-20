class Consulta {
  constructor(paciente, data, horaInicio, horaFim) {
    this.paciente = paciente;
    this.data = data; 
    this.horaInicio = horaInicio; 
    this.horaFim = horaFim; 
  }

  validarHorario() {
    const horaValida = (hora) => hora % 15 === 0;
    if (!horaValida(this.horaInicio) || !horaValida(this.horaFim)) {
      throw new Error("Horários inválidos. As horas devem ser múltiplos de 15 minutos.");
    }

    const horarioConsultorio = [800, 1900]; 
    if (this.horaInicio < horarioConsultorio[0] || this.horaFim > horarioConsultorio[1]) {
      throw new Error("Horário fora do período de funcionamento do consultório (08:00 - 19:00).");
    }

    if (this.horaInicio >= this.horaFim) {
      throw new Error("Hora final não pode ser antes da hora inicial.");
    }
  }

  isFuturo(agora) {
    const dataConsulta = new Date(this.data.split("/").reverse().join("-"));
    const horaInicio = `${this.horaInicio.toString().padStart(4, "0").slice(0, 2)}:${this.horaInicio.toString().padStart(4, "0").slice(2, 4)}`;
    const [horas, minutos] = horaInicio.split(":").map(Number);
    dataConsulta.setHours(horas);
    dataConsulta.setMinutes(minutos);
    
    return dataConsulta > agora;
  }

  validarData(agora) {
    if (!this.isFuturo(agora)) {
      throw new Error("A consulta deve ser agendada para um horário futuro.");
    }
  }
}
