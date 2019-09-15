'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {

  //Uma Order pode TEM um ou vários Items
  //Um item pertence apenas a uma ordem
  //Relacionamento 1:N 
  items() {
    return this.hasMany('App/Models/OrderItem')
  }

  //Uma Order pode ter um ou mais cupons
  //Um cupon pode ser aplicado à uma ou várias ordens.
   //Relacionamento N:N 
  coupons() {
    return this.belongsToMany('App/Models/Coupon')
  }

  discounts() {
    return this.belongsToMany('App/Models/Discount')
  }

  //Uma ordem está atrelada apenas a 1 usuário
  //um usuario pode ter várias ordens
  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Order
