'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Env = use('Env')

const Category = use('App/Models/Category')

const Transformer = use('App/Transformers/Admin/CategoryTransformer')
/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   *
   * @param { Object } ctx.pagination
   * @param {TransformerWith} ctx.transform
   */
  async index({ request, response, transform, pagination }) {
    const title = request.input('title')

    //Não executa a query, apenas define o querybuild,
    //por isso não tem o await
    const query = Category.query()

    if (title) {
      //Postgres ILIKE for case insensitive.
      if (Env.get('DB_CONNECTION') == 'pg')
        query.where('title', 'ILIKE', `%${title}%`)
      else {
        query.where('title', 'LIKE', `%${title}%`)
      }
    }

    //paginate(x,y)
    //x é a primeiira página e o y é o limite do número de páginas.
    //Agora sim executa a query...
    let categories = await query.paginate(pagination.page, pagination.limit)

    categories = await transform.paginate(categories, Transformer)

    return response.send({ categories })
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      //Pegou as informações que vieram do request via desestruturação
      const { title, description, image_id } = request.all()

      //Criou no banco de dados uma entry usando o modelo Category
      //com as informações qo request.
      const category = await Category.create({ title, description, image_id })

      //returna OK
      return response.status(201).send({ category })
    } catch (error) {
      //Não foi possível criar, então retornar um erro.
      //Nos testes, o image_id precisa estar vinculado
      return response.status(400).send({
        message: 'Erro ao processar a sua solicitação'
      })
    }
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const category = await Category.findOrFail(params.id)

    return response.status(200).send({ category })
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)

    const { title, description, image_id } = request.all()

    category.merge({ title, description, image_id })

    await category.save()

    return response.send({ category })
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)
    await category.delete()
    //status=204 - No body response
    return response.status(204).send({})
  }
}

module.exports = CategoryController
