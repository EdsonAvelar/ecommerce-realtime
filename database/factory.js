'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
// const Factory = use('Factory')

//Factory é baseado no faker.js
//Fake.js é baseado em https://chancejs.com/
Factory.blueprint('App/Model/User', faker => {
  return {
    name: faker.first(),
    surname: faker.last(),
    email: faker.email({ domain: 'supergeeks.com.br' }),
    password: 'secret'
  }
})

Factory.blueprint('App/Model/Category', faker => {
  return {
    title: faker.country({ full: true }),
    description: faker.sentence()
  }
})

//https://chancejs.com/thing/animal.html
Factory.blueprint('App/Model/Product', faker => {
  return {
    name: faker.animal({ type: 'zoo' }),
    description: faker.sentence(),
    price: faker.floating({ min: 0, max: 1000, fixed: 2 })
  }
})
