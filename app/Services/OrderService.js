'use strict'

class OrderService {
  constructor(model, trx = false) {
    this.model = model
    trhis.trx = trx
  }

  async syncItems(items) {
    if (!Array.isArray(items)) return false

    await this.model.items().delete(this.trx)
    return await this.model.items().createMany(items, this.trx)
  }

  async updateItems (item){
      let currentItems = await this.model.item().whereIn('id',item.)
  }
}
