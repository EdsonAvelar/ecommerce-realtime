'use strict'

class AdminStoreOrder {
  get rules() {
    return {
      // validation rules
      //Nesse caso valida se foi enviado um campo
      // product_id e esse campo existe na tabela products e coluna id
      //O validator exists foi criado e está dentro do código
      /** @type {import('../../../start/hooks')} */
      /** @ref https://adonisjs.com/docs/4.1/validator#_extending_validator**/
      'items.*.product_id': 'exists:products,id',
      'items.*.quantity': 'min:1'
    }
  }
}

module.exports = AdminStoreOrder
