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
  Route.post('register', 'AuthController.register')
    .as('auth.register')
    .middleware(['guest'])
    .validator('Auth/Register')

  Route.post('login', 'AuthController.login')
    .as('auth.login')
    .middleware(['guest'])
    .validator('Auth/Login')

  Route.post('refresh', 'AuthController.refresh')
    .as('auth.refresh')
    .middleware(['guest'])

  Route.post('logout', 'AuthController.logout')
    .as('auth.logout')
    .middleware(['auth'])

  //Reset Password Routes
  Route.post('reset-password', 'AuthController.forgot')
    .as('auth.forgot')
    .middleware(['guest'])

  Route.get('reset-password', 'AuthController.remember')
    .as('auth.remember')
    .middleware(['guest'])

  Route.put('reset-password', 'AuthController.reset')
    .as('auth.reset')
    .middleware(['guest'])
})
  .prefix('v1/auth')
  .namespace('Auth')
