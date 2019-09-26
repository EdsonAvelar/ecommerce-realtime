'use strict'

class Login {
  get rules() {
    return {
      // validation rules
      email: 'required|email',
      password: 'required'
    }
  }

  get messages() {
    return {
      'email.required': 'O email já existe',
      'email.email': 'O email não é válido',
      'password.required': 'É necessário enviar o password'
    }
  }
}

module.exports = Login
