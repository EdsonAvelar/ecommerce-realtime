'use strict'

/*
|--------------------------------------------------------------------------
| ClientSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use('Role')
const User = use('App/Models/User')

class ClientSeeder {
  async run() {
    const role = await Role.findBy('slug', 'client')
    const Clients = await Factory.model('App/Model/User').createMany(20)

    await Promise.all(
      clients.map(async client => {
        await client.roles().attach([role.id])
      })
    )

    const admin = await User.create({
      name: 'Adriano Avelar',
      email: 'eam.avelar@gmail.com',
      password: 'secret'
    })

    const adminRole = await Role.findBy('slug', 'admin')
    await admin.roles().attach([adminRole.id])
  }
}

module.exports = ClientSeeder
