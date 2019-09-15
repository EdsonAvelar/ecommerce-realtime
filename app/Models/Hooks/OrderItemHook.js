'use strict'

const OrderItemHook = (exports = module.exports = {})

const Product = use('App/Models/Product')

OrderItemHook.method = async model => {
  let product = await Product.find(model.product_id)

  //insere no model o valor de subtotal
  model.subtotal = model.quantity * product.price
}
