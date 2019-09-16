'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const Role = use('Role')

class RoleSeeder {
  async run() {

    //Role de Admin
    await Role.create({
      name: 'Admin',
      slug: 'admin',
      description: 'System Admin'
    })

    //Role de Admin
    await Role.create({
      name: 'Manager',
      slug: 'manager',
      description: 'System Manager'
    })

    //Role de Cliente
    await Role.create({
      name: 'Client',
      slug: 'client',
      description: 'System Client'
    })
  }
}

module.exports = RoleSeeder
