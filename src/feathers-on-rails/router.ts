import Router from '@koa/router'
import IndexController from './controllers/IndexController'
import AuthController from './controllers/AuthController'

export const configureRoutes = (router: Router) => {
  router.get('/', IndexController.index)
  router.get('/redirect', IndexController.redirect)

  router.get('/login', AuthController.login)
  router.post('/login', AuthController.performLogin)
  router.get('/signup', AuthController.signup)
  router.post('/signup', AuthController.performSignup)
  router.get('/logout', AuthController.logout)
}
