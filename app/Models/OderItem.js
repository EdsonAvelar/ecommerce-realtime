'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OderItem extends Model {

    product(){
        return this.belongsTo('App/Models/Product')
    }

    order(){
        return this.belongsTo('App/Models/Orde')
    }
}

module.exports = OderItem
