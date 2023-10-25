import Router from '@koa/router'
import IndexController from './controllers/IndexController'
import AuthController from './controllers/AuthController'
import PostController from './controllers/PostController'

export const configureRoutes = (router: Router) => {
  router.get('/', IndexController.index)
  router.get('/redirect', IndexController.redirect)

  router.get('/login', AuthController.login)
  router.post('/login', AuthController.performLogin)
  router.get('/signup', AuthController.signup)
  router.post('/signup', AuthController.performSignup)
  router.get('/logout', AuthController.logout)

  router.get('/post/new', PostController.new)
  router.get('/post/:id', PostController.show)
  router.post('/post', PostController.create)
}
