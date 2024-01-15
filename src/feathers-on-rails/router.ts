import Router from '@koa/router'
import IndexController from './controllers/IndexController'
import AuthController from './controllers/AuthController'
import PostController from './controllers/PostController'
import SearchController from './controllers/SearchController'

export const configureRoutes = (router: Router) => {
  router.get('/', (ctx) => IndexController.index(ctx))
  router.get('/posts/page/:pageNr', (ctx) => IndexController.postsPage(ctx))
  router.get('/redirect', (ctx) => IndexController.redirect(ctx))
  router.get('/changeLang/:lang', (ctx) => IndexController.changeLang(ctx))

  router.get('/login', (ctx) => AuthController.login(ctx))
  router.post('/login', (ctx) => AuthController.performLogin(ctx))
  router.get('/signup', (ctx) => AuthController.signup(ctx))
  router.post('/signup', (ctx) => AuthController.performSignup(ctx))
  router.get('/logout', (ctx) => AuthController.logout(ctx))
  router.get('/profile', (ctx) => AuthController.profile(ctx))
  router.post('/change-password', (ctx) => AuthController.changePassword(ctx))
  router.get('/forgot-password', (ctx) => AuthController.forgotPassword(ctx))
  router.post('/restore-password', (ctx) => AuthController.restorePassword(ctx))
  router.get('/new-password', (ctx) => AuthController.newPassword(ctx))
  router.post('/confirm-new-password', (ctx) => AuthController.confirmNewPassword(ctx))
  router.get('/verify', (ctx) => AuthController.verify(ctx))

  router.get('/posts/new', (ctx) => PostController.new(ctx))
  router.get('/posts/my', (ctx) => PostController.myPosts(ctx))
  router.get('/posts/:id', (ctx) => PostController.show(ctx))
  router.get('/posts/:id/edit', (ctx) => PostController.edit(ctx))
  router.post('/posts', (ctx) => PostController.create(ctx))
  router.post('/posts/:id/delete', (ctx) => PostController.remove(ctx))
  router.post('/posts/:id', (ctx) => PostController.update(ctx))

  router.get('/search', (ctx) => SearchController.search(ctx))
}
