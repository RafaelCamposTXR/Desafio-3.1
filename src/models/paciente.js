class Paciente {
  constructor(cpf, nome, dataNascimento) {
    this.cpf = cpf;
    this.nome = nome;
    this.dataNascimento = dataNascimento;
    this.consultas = []; 
  }


  validarCpf() {
    const cpf = this.cpf.replace(/[^\d]/g, ''); 

    if (!cpf || cpf.length !== 11 || /^(.)\1{10}$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    let peso = 10; 
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * peso--; 
    }

    let resto = soma % 11;
    let primeiroDigitoVerificador = resto < 2 ? 0 : 11 - resto;


    soma = 0;
    peso = 11; 
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * peso--; 
    }

    resto = soma % 11;
    let segundoDigitoVerificador = resto < 2 ? 0 : 11 - resto;


    return cpf.charAt(9) == primeiroDigitoVerificador && cpf.charAt(10) == segundoDigitoVerificador;
  }


  validarNome() {
    return this.nome.length >= 5;
  }


  validarDataNascimento() {
    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = this.dataNascimento.match(regexData);

    if (!match) {
      return false; 
    }

    const [dia, mes, ano] = match.slice(1).map(Number);
    const dataNascimento = new Date(ano, mes - 1, dia);
    const idade = this.calcularIdade(dataNascimento);

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


  validarDados() {
    if (!this.validarCPF()) {
      console.log('CPF inválido.');
      return false;
    }
    if (!this.validarNome()) {
      console.log('Nome deve ter pelo menos 5 caracteres.');
      return false;
    }
    if (!this.validarDataNascimento()) {
      console.log('Paciente deve ter pelo menos 13 anos e a data de nascimento deve ser válida.');
      return false;
    }
    return true;
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
