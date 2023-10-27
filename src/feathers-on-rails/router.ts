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

  router.get('/posts/new', PostController.new)
  router.get('/posts/:id', PostController.show)
  router.post('/posts', PostController.create)
  router.delete('/posts/:id', PostController.remove)
}
