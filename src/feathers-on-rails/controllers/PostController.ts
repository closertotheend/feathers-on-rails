import { ParameterizedContext } from 'koa'
import { Controller } from '../internal/Controller'

class PostController extends Controller {
  async new(ctx: ParameterizedContext) {
    const userId = Controller.session(ctx).user?.id
    if (!userId) {
      return await Controller.render(ctx, 'views/internal/not-authorized.ejs')
    }
    await Controller.render(ctx, 'views/posts/new.ejs')
  }

  async create(ctx: ParameterizedContext) {
    const userId = Controller.session(ctx).user.id
    if (!userId) {
      return await Controller.render(ctx, 'views/internal/not-authorized.ejs')
    }
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

  async edit(ctx: ParameterizedContext) {
    const userId = Controller.session(ctx).user?.id
    if (!userId) {
      return await Controller.render(ctx, 'views/internal/not-authorized.ejs')
    }
    const postId = ctx.params.id
    const post = await Controller.app.service('api/posts').get(postId)
    await Controller.render(ctx, 'views/posts/edit.ejs', {
      post,
      postBelongsToCurrentUser: userId === post.userId
    })
  }

  async update(ctx: ParameterizedContext) {
    const userId = Controller.session(ctx).user.id
    if (!userId) {
      return await Controller.render(ctx, 'views/internal/not-authorized.ejs')
    }
    const postId = ctx.params.id
    if((await Controller.app.service('api/posts').get(postId)).userId !== userId){
      return await Controller.render(ctx, 'views/internal/not-authorized.ejs')
    }
    await Controller.app.service('api/posts').patch(postId, ctx.request.body)
    Controller.flash(ctx).set('info', 'Post updated')
    Controller.redirect(ctx, '/posts/' + postId)
  }

  async remove(ctx: ParameterizedContext) {
    const postId = ctx.params.id
    await Controller.app.service('api/posts').remove(postId)
    Controller.flash(ctx).set('info', 'Post removed')
    ctx.set('HX-Redirect', '/')
  }
}

export default new PostController()
