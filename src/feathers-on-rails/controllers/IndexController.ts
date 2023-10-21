import { ParameterizedContext } from 'koa'
import { Controller } from '../internal/Controller'

class IndexController extends Controller {
  async index(ctx: ParameterizedContext) {
    await Controller.html(ctx, 'views/home/index.ejs', { title: 'someTitle' })
  }

  async redirect(ctx: ParameterizedContext) {
    Controller.flash(ctx).set('info', 'You have been redirected to main page')
    await Controller.redirect(ctx, '/')
  }
}

export default new IndexController()
