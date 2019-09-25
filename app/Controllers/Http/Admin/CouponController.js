'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Coupon = use('App/Models/Coupon')
const Database = use('Database')

const Service = use('App/Services/CouponServices')
/**
 * Resourceful controller for interacting with coupons
 */
class CouponController {
  /**
   * Show a list of all coupons.
   * GET coupons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   * @param { Object } ctx.pagination
   */
  async index({ request, response, pagination }) {
    const code = request.input('code')

    const query = Coupon.query()

    if (code) {
      //Postgres ILIKE for case insensitive.
      if (Env.get('DB_CONNECTION') == 'pg')
        query.where('code', 'ILIKE', `%${code}%`)
      else {
        query.where('code', 'LIKE', `%${code}%`)
      }
    }

    const coupon = await query.paginate(pagination.page, pagination.limit)

    return response.send({ coupon })
  }

  /**
   * Create/save a new coupon.
   * POST coupons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    /**
     * 1 - Produto - pode ser utilizado apenas em produtos específicos
     * 2 - Clients - pode ser utilizado apenas por clientes específicos
     * 3 - clientes e products - pode ser utilizado somente em produtos e clientes específicos
     * 4 - pode ser utilizado por qualquer clientes em qualquer pedidos
     */

    const trx = await Database.beginTransaction()

    let can_use_for = {
      client: false,
      product: false
    }

    try {
      const couponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_until',
        'type',
        'recursive'
      ])

      const { users, products } = request.only(['users', 'products'])

      const coupon = await Coupon.create(couponData, trx)

      //starts service layer
      const service = new Service(coupon, trx)

      //insere os relacionamentos no db.
      if (users && users.lenght > 0) {
        await service.syncUsers(users)
        can_use_for.client = true
      }

      if (products && products.lenght > 0) {
        await service.syncProducts(products)
        can_use_for.product = true
      }

      if (can_use_for.product && can_use_for.client) {
        coupon.can_use_for = 'product_client'
      } else if (can_use_for.product && !can_use_for.client) {
        coupon.can_use_for = 'product'
      } else if (!can_use_for.product && can_use_for.client) {
        coupon.can_use_for = 'client'
      } else {
        coupon.can_use_for = 'all'
      }

      await coupon.save(trx)

      trx.commit()

      return response.status(201).send(coupon)
    } catch (error) {
      await trx.rollback()
      return response
        .status(400)
        .send({ message: 'Não foi possível criar o Cupom' })
    }
  }

  /**
   * Display a single coupon.
   * GET coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, request, response, view }) {
    const coupon = await Coupon.findOrFail(id)

    return response.send({ coupon })
  }

  /**
   * Update coupon details.
   * PUT or PATCH coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    const trx = await Database.beginTransaction()

    let coupon = await Coupon.findOrFail(id)
    let can_use_for = {
      client: false,
      product: false
    }

    try {
      const couponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_until',
        'type',
        'recursive'
      ])

      coupon.merge(couponData)

      const { users, products } = request.only(['users', 'products'])

      const service = new Service(coupon, trx)

      //insere os relacionamentos no db.
      if (users && users.lenght > 0) {
        await service.syncUsers(users)
        can_use_for.client = true
      }

      if (products && products.lenght > 0) {
        await service.syncProducts(products)
        can_use_for.product = true
      }

      if (can_use_for.product && can_use_for.client) {
        coupon.can_use_for = 'product_client'
      } else if (can_use_for.product && !can_use_for.client) {
        coupon.can_use_for = 'product'
      } else if (!can_use_for.product && can_use_for.client) {
        coupon.can_use_for = 'client'
      } else {
        coupon.can_use_for = 'all'
      }

      await coupon.save(trx)
      await trx.commit()

      response.status(200).send(coupon)
    } catch (error) {
      await trx.rollback()
      return response
        .status(400)
        .send({ message: 'Não foi possível atualizar este cupom no momento.' })
    }
  }

  /**
   * Delete a coupon with id.
   * DELETE coupons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const trx = Database.beginTransaction()
    const coupon = await Coupon.findOrFail(id)

    try {
      //remove relacionamentos do coupon
      await coupon.products().detach([], trx)
      await coupon.orders().detach([], trx)
      await coupon.users().detach([], trx)
      //delete o cupon
      await coupon.delete(trx)

      //comita as mudanças
      await trx.commit()

      return response.status(404).send({})
    } catch (error) {
      //se acontecer algum erro, refaça as transações...
      await trx.rollback()

      return response
        .status(400)
        .send({ message: 'Não foi possível deletar este cupom!' })
    }
  }
}

module.exports = CouponController
