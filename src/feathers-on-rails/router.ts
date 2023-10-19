import Router from '@koa/router'
import IndexController from './controllers/IndexController'
import AuthController from './controllers/AuthController'

export const configureRoutes = (r: Router) => {
  r.get('/', (ctx) => IndexController.index(ctx))
  r.get('/redirect', (ctx) => IndexController.redirect(ctx))

  r.get('/login', (ctx) => AuthController.login(ctx))
  r.post('/login', (ctx) => AuthController.performLogin(ctx))
  r.get('/signup', (ctx) => AuthController.signup(ctx))  
  r.post('/signup', (ctx) => AuthController.performSignup(ctx))  
  r.get('/logout', (ctx) => AuthController.logout(ctx))  
}
