'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Env = use('Env')
const Image = use('App/Models/Image')

const fs = use('fs')

const { manage_single_upload, manage_multiple_uploads } = use('App/Helpers')
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
    const images = await query
      .orderBy('id', 'DESC')
      .paginate(pagination.page, pagination.limit)

    return response.send({ images })
  }

  async store({ request, response }) {
    try {
      const fileJar = request.file('images', {
        types: ['image'],
        size: '2mb'
      })

      let images = []
      //checando se são vários arquivos enviados...
      if (!fileJar.files) {
        const file = await manage_single_upload(fileJar)

        if (file.moved()) {
          const image = await Image.create({
            path: file.fileName,
            size: file.size,
            original_name: file.clientName,
            extension: file.subtype
          })

          images.push(image)

          return response.status(201).send({ successes: images, errors: {} })
        }

        return response.status(400).send({
          message: 'Não foi possível processar esta imagem'
        })
      } else {
        let files = await manage_multiple_uploads(fileJar)

        await Promise.all(
          files.successes.map(async file => {
            const image = await Image.create({
              path: file.fileName,
              size: file.size,
              original_name: file.clientName,
              extension: file.subtype
            })

            images.push(image)
          })
        )

        return response
          .status(200)
          .send({ successes: images, errors: files.errors })
      }
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao salvar as imagens' + error
      })
    }
  }

  async show({ params: { id }, request, response, view }) {
    const image = await Image.findOrFail(id)

    return response.status(200).send({ image })
  }

  async update({ params: { id }, request, response }) {
    const image = await Image.findOrFail(id)
    try {
      const { original_name } = request.all()

      image.merge({ path, size, original_name })

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

    try {
      let filePath = Helpers.publicPath(`uploads/${image.path}`)

      await fs.unlink(filePath, async err => {
        if (!err) await image.delete()
      })

      return response.status(204).send({})
    } catch (error) {
      return response.status(400).send({ message: 'Erro ao deletar a imagem' })
    }
  }
}

module.exports = ImageController
