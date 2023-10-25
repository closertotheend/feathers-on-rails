import { ParameterizedContext } from 'koa'
import { Controller } from '../internal/Controller'

class PostController extends Controller {
  async new(ctx: ParameterizedContext) {
    await Controller.render(ctx, 'views/post/new.ejs')
  }

  async create(ctx: ParameterizedContext) {
    const userId = Controller.session(ctx).user.id
    const post = await Controller.app
      .service('api/posts')
      .create({ ...ctx.request.body, userId: userId } as any)
    Controller.flash(ctx).set('info', 'Post created')
    Controller.redirect(ctx, '/post/' + post.id)
  }

  async show(ctx: ParameterizedContext) {
    const postId = ctx.params.id
    const post = await Controller.app.service('api/posts').get(postId)
    await Controller.render(ctx, 'views/post/show.ejs', { post })
  }
}

export default new PostController()
