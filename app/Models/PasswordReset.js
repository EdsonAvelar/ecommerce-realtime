'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PasswordReset extends Model {
  static boot() {
    super.boot()

    this.addHook('beforeCreate', async model =>{
        model.token = wait str_random(25)

        const expires_at = new Date()
        expires_at.setMinutes(expires_at.getMinutes() + 30)

        model.expires_at = expires_at
    })
  }

  //Formata os valores para o padrão do Postgres
  //o lucid (ORM do Adonis) chama esse métrodo
  //automaticamente 
  static get dates(){
      return ['created_at','updated_at','expires_at']
  }
}

module.exports = PasswordReset
