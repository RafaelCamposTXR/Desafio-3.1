class Paciente {
  constructor(cpf, nome, dataNascimento) {
    if (!this.validarCPF(cpf)) {
      throw new Error('CPF inválido.');
    }
    if (!this.validarNome(nome)) {
      throw new Error('Nome deve ter pelo menos 5 caracteres.');
    }
    if (!this.validarDataNascimento(dataNascimento)) {
      throw new Error('Paciente deve ter pelo menos 13 anos e a data de nascimento deve ser válida.');
    }

    this.cpf = cpf;
    this.nome = nome;
    this.dataNascimento = dataNascimento;
    this.consultas = []; 
  }

  validarCPF(cpf) {
    const cpfFormatado = cpf.replace(/[^\d]/g, ''); 

    if (!cpfFormatado || cpfFormatado.length !== 11 || /^(.)\1{10}$/.test(cpfFormatado)) {
      return false;
    }

    let soma = 0;
    let peso = 10; 
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfFormatado.charAt(i)) * peso--; 
    }

    let resto = soma % 11;
    let primeiroDigitoVerificador = resto < 2 ? 0 : 11 - resto;

    soma = 0;
    peso = 11; 
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfFormatado.charAt(i)) * peso--; 
    }

    resto = soma % 11;
    let segundoDigitoVerificador = resto < 2 ? 0 : 11 - resto;

    return cpfFormatado.charAt(9) == primeiroDigitoVerificador && cpfFormatado.charAt(10) == segundoDigitoVerificador;
  }

  validarNome(nome) {
    return nome.length >= 5;
  }

  validarDataNascimento(dataNascimento) {
    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dataNascimento.match(regexData);

    if (!match) {
      return false; 
    }

    const [dia, mes, ano] = match.slice(1).map(Number);
    const dataNascimentoObj = new Date(ano, mes - 1, dia);
    const idade = this.calcularIdade(dataNascimentoObj);

    return idade >= 13;
  }

  calcularIdade(dataNascimento) {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const m = hoje.getMonth() - dataNascimento.getMonth();

    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }

    return idade;
  }

  adicionarConsulta(consulta) {
    this.consultas.push(consulta);
  }

  temConsultasFuturas() {
    const hoje = new Date();
    return this.consultas.some(consulta => new Date(consulta.data) > hoje);
  }

  removerConsulta(consulta) {
    const index = this.consultas.indexOf(consulta);
    if (index !== -1) {
      this.consultas.splice(index, 1);
    }
  }
}

export default Paciente;