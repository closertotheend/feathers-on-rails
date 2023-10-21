import Router from '@koa/router'
import IndexController from './controllers/IndexController'
import AuthController from './controllers/AuthController'

export const configureRoutes = (r: Router) => {
  r.get('/', IndexController.index)
  r.get('/redirect', IndexController.redirect)

  r.get('/login', AuthController.login)
  r.post('/login', AuthController.performLogin)
  r.get('/signup', AuthController.signup)
  r.post('/signup', AuthController.performSignup)
  r.get('/logout', AuthController.logout)
}
