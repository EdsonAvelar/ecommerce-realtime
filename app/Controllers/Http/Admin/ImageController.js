'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Image = use('App/Models/Image')
/**
 * Resourceful controller for interacting with images
 */
class ImageController {
  /**
   * Show a list of all images.
   * GET images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   * @param {View} ctx.pagination
   */
  async index({ request, response, pagination }) {
    const original_name = request.input('original_name')

    //Não executa a query, apenas define o querybuild,
    //por isso não tem o await
    const query = Image.query()

    if (original_name) {
      //Postgres ILIKE for case insensitive.
      if (Env.get('DB_CONNECTION') == 'pg')
        query.where('original_name', 'ILIKE', `%${original_name}%`)
      else {
        query.where('original_name', 'LIKE', `%${original_name}%`)
      }
    }

    //paginate(x,y)
    //x é a primeiira página e o y é o limite do número de páginas.
    //Agora sim executa a query...
    const images = await query.paginate(pagination.page, pagination.limit)

    return response.send({ images })
  }

  async store({ request, response }) {
    try {
      const { path, size, original_name, extension } = request.all()
      const image = await Image.create({ path, size, original_name, extension })

      return response.status(201).send({ image })
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao criar uma nova imagem'
      })
    }
  }

  async show({ params: { id }, request, response, view }) {
    const image = await Image.find(id)

    return response.status(200).send({ image })
  }

  async update({ params: { id }, request, response }) {
    try {
      const image = await Image.findOrFail(id)

      const { path, size, original_name, extension } = request.all()

      image.merge({ path, size, original_name, extension })

      await image.save()

      return response.send({ image })
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Erro ao atualizar a imagem' })
    }
  }

  async destroy({ params: { id }, request, response }) {
    const image = await Image.findOrFail(id)
    await image.delete()

    return response.status(204).send({})
  }
}

module.exports = ImageController
