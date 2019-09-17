'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
const Env = use('Env')
/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   * @param {View} ctx.pagination
   */
  async index({ request, response, pagination }) {
    const name = request.input('name')

    //Não executa a query, apenas define o querybuild,
    //por isso não tem o await
    const query = User.query()

    if (name) {
      let like = 'LIKE'

      //Postgres ILIKE for case insensitive.
      if (Env.get('DB_CONNECTION') == 'pg') like = 'ILIKE'

      query.where('name', like, `%${name}%`)
      query.orWhere('surname', like, `%${name}%`)
      query.orWhere('email', like, `%${name}%`)
    }

    //paginate(x,y)
    //x é a primeiira página e o y é o limite do número de páginas.
    //Agora sim executa a query...
    const users = await query.paginate(pagination.page, pagination.limit)

    return response.send({ users })
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      //Pegou as informações que vieram do request via desestruturação
      const { name, surname, email, password } = request.all()

      //Criou no banco de dados uma entry usando o modelo user
      //com as informações qo request.
      const user = await User.create({
        name,
        surname,
        email,
        password
      })

      //returna OK
      return response.status(201).send({ user })
    } catch (error) {
      //Não foi possível criar, então retornar um erro.
      //Nos testes, o image_id precisa estar vinculado
      return response.status(400).send({
        message: 'Erro ao criar um novo usuário' + error
      })
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, response }) {
    //params: {id}
    //if fail ... brake
    const user = await User.findOrFail(id)

    return response.status(200).send({ user })
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const user = await User.findOrFail(params.id)

    try {
      const { name, surname, email, password } = request.all()
      user.merge({ name, surname, email, password })

      await user.save()
      return response.status(204).send({ user })
    } catch (error) {
      return response
        .status(error.status)
        .send({ message: 'Erro ao atualizar o produto' })
    }
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, response }) {
    const user = await User.findOrFail(id)

    try {
      await user.delete()
      //status=204 - No body response
      return response.status(204).send({})
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'Não foi possível deleter o produto' })
    }
  }
}

module.exports = UserController
