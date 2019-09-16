'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')
const Env = use('Env')
/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   *
   * @param { Object } ctx.pagination
   */

  async index({ request, response, pagination }) {
    const name = request.input('name')

    //Não executa a query, apenas define o querybuild,
    //por isso não tem o await
    const query = Product.query()

    if (name) {
      //Postgres ILIKE for case insensitive.
      if (Env.get('DB_CONNECTION') == 'pg')
        query.where('name', 'ILIKE', `%${name}%`)
      else {
        query.where('name', 'LIKE', `%${name}%`)
      }
    }

    //paginate(x,y)
    //x é a primeiira página e o y é o limite do número de páginas.
    //Agora sim executa a query...
    const categories = await query.paginate(pagination.page, pagination.limit)

    return response.send({ categories })
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      //Pegou as informações que vieram do request via desestruturação
      const { name, description, image_id, price } = request.all()

      //Criou no banco de dados uma entry usando o modelo Product
      //com as informações qo request.
      const product = await Product.create({
        name,
        description,
        image_id,
        price
      })

      //returna OK
      return response.status(201).send({ product })
    } catch (error) {
      //Não foi possível criar, então retornar um erro.
      //Nos testes, o image_id precisa estar vinculado
      return response.status(400).send({
        message: 'Erro criar um novo produto'
      })
    }
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    //params: {id}
    //if fail ... brake
    const product = await Product.findOrFail(params.id)

    return response.status(200).send({ product })
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const products = await Product.findOrFail(params.id)

    try {
      const { name, description, price, image_id } = request.all()
      products.merge({ name, description, price, image_id })

      await products.save()
      return response.status(204).send({ products })
    } catch (error) {
      return response
        .status(error.status)
        .send({ message: 'Erro ao atualizar o produto' })
    }
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)

    try {
      await product.delete()
      //status=204 - No body response
      return response.status(204).send({})
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'Não foi possível deleter o produto' })
    }
  }
}

module.exports = ProductController
