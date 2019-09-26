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
 * Importa as Rotas de Authenticação
 */
require('./auth')

/**
 * Importa as Rodas de Admin
 */
require('./admin')

/**
 * Importa as Rodas de Client
 */
require('./client')
