'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
  /**
   * Imagem de destaque
   */
  image() {
    this.belongsTo('App/Models/Image')
  }

  /**
   * Galeria de Imagens
   */
  images() {
    return this.belongsToMany('App/Models/Image')
  }

  /**
   * Relacionamento entre produtos e categorias.
   */
  categories() {
    return this.belongsToMany('App/Models/Category')
  }

  /**
   * Relacionamento entre produtos e cupons de desconto
   */
  coupons() {
    return this.belongsToMany('App/Models/Coupon')
  }
}

module.exports = Product
