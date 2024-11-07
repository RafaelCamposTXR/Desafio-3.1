class Paciente {
  constructor(cpf, nome, dataNascimento) {
    this.cpf = cpf;
    this.nome = nome;
    this.dataNascimento = dataNascimento;
    this.consultas = []; 
  }


  validarCPF() {
    const regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/; 
    return regex.test(this.cpf);
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
