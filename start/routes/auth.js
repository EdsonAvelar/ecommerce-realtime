'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

/**
 * Auth Routes
 * namespace:  pasta dentro de App onde estão os Contollers
 * App/Controllers/Http/Auth
 */
Route.group(() => {
  //Authenticate Routes
  Route.post('register', 'AuthController.register').as('auth.register')
  Route.post('login', 'AuthController.login').as('auth.login')
  Route.post('refresh', 'AuthController.refresh').as('auth.refresh')
  Route.post('logout', 'AuthController.logout').as('auth.logout')

  //Reset Password Routes
  Route.post('reset-password', 'AuthController.forgot').as('auth.forgot')
  Route.get('reset-password', 'AuthController.remember').as('auth.remember')
  Route.put('reset-password', 'AuthController.reset').as('auth.reset')
})
  .prefix('v1/auth')
  .namespace('Auth')
