'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

/**
 * Essa migration do tipo select é usada
 * para quando as tabelas do relacionamento ainda
 * não estão prontas...
 * tipo, User precisa referenciar imagem mas
 * a tabela de imagem ainda não foi criada...
 * Se Image for criada primeiro, essa tabela
 * UserImagemFk não precisaria existiir...
 */
class UserImageFkSchema extends Schema {
  up() {
    this.table('users', table => {
      table
        .foreign('image_id')
        .references('id')
        .inTable('images')
        .onDelete('cascade')
    })
  }

  down() {
    this.table('users', table => {
      table.dropForeign('image_id')
    })
  }
}

module.exports = UserImageFkSchema
