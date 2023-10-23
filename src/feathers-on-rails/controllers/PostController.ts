import { ParameterizedContext } from 'koa'
import { Controller } from '../internal/Controller'

class PostController extends Controller {
  async new(ctx: ParameterizedContext) {
    await Controller.html(ctx, 'views/post/new.ejs')
  }

  async create(ctx: ParameterizedContext) {
    console.log(123123, ctx.request.body)
    const userId = Controller.session(ctx).user.id
    const createdPost = await Controller.app.service('api/posts').create({...ctx.request.body, userId: userId}  as any)
    console.log(createdPost)
    Controller.flash(ctx).set('info', 'Post created')
    Controller.redirect(ctx, 'post/new')
  }
}

export default new PostController()
