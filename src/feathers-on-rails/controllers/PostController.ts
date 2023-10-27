import { ParameterizedContext } from 'koa'
import { Controller } from '../internal/Controller'

class PostController extends Controller {
  async new(ctx: ParameterizedContext) {
    await Controller.render(ctx, 'views/posts/new.ejs')
  }

  async create(ctx: ParameterizedContext) {
    const userId = Controller.session(ctx).user.id
    const post = await Controller.app
      .service('api/posts')
      .create({ ...ctx.request.body, userId: userId } as any)
    Controller.flash(ctx).set('info', 'Post created')
    Controller.redirect(ctx, '/posts/' + post.id)
  }

  async show(ctx: ParameterizedContext) {
    const postId = ctx.params.id
    const post = await Controller.app.service('api/posts').get(postId)
    await Controller.render(ctx, 'views/posts/show.ejs', {
      post,
      postBelongsToCurrentUser: Controller.session(ctx).user?.id === post.userId
    })
  }

  async remove(ctx: ParameterizedContext) {
    const postId = ctx.params.id
    await Controller.app.service('api/posts').remove(postId)
    Controller.flash(ctx).set('info', 'Post removed')
    ctx.set('HX-Redirect', '/');
  }
}

export default new PostController()
