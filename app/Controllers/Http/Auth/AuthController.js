'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Role = use('Role')

class AuthController {
  async register({ request, response }) {
    // transaction os dados só são persistido
    // no banco se todas as operações dão
    //  sucesso. Caso alguma deu errado,
    //   o banco executará um rollback e
    //   apagará todos os dados inseridos
    const transaction = await Database.beginTransaction()

    try {
      const { name, surname, email, password } = request.all()
      const user = await User.create(
        { name, surname, email, password },
        transaction
      )

      const role = await Role.findBy('slug', 'client')

      await user.roles().attach([role.id], null, transaction)

      //Comita a transaction..
      //os dados estão pendentes e só será confirmado após o
      //commit da transaction
      await transaction.commit()

      return response.status(201).send({ data: user })
    } catch (error) {
      await transaction.rollback()
      return response
        .status(400)
        .send({ message: use('Antl').formatMessage('error.user_register') })
    }
  }

  async login({ request, response, auth }) {
    const { email, password } = request.all()

    let data = await auth.withRefreshToken().attempt(email, password)

    return response.send({ data })
  }

  async refresh({ request, response, auth }) {}

  async logout({ request, response, auth }) {}

  async forgot({ request, response }) {}

  async remember({ request, response }) {}

  async reset({ request, response }) {}
}

module.exports = AuthController
