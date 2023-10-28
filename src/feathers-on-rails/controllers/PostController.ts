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
    const post = await Controller.app.service('api/posts').create({ ...ctx.request.body, userId } as any)
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
    const postId = ctx.params.id
    const userId = await this.checkCorrectUserAccessing(postId, ctx)
    const post = await Controller.app.service('api/posts').get(postId)
    await Controller.render(ctx, 'views/posts/edit.ejs', {
      post,
      postBelongsToCurrentUser: userId === post.userId
    })
  }

  async update(ctx: ParameterizedContext) {
    const postId = ctx.params.id
    await this.checkCorrectUserAccessing(postId, ctx)
    await Controller.app.service('api/posts').patch(postId, ctx.request.body)
    Controller.flash(ctx).set('info', 'Post updated')
    Controller.redirect(ctx, '/posts/' + postId)
  }

  async remove(ctx: ParameterizedContext) {
    const postId = ctx.params.id
    await this.checkCorrectUserAccessing(postId, ctx)
    await Controller.app.service('api/posts').remove(postId)
    Controller.flash(ctx).set('info', 'Post removed')
    ctx.set('HX-Redirect', '/')
  }

  private async checkCorrectUserAccessing(postId: number, ctx: ParameterizedContext) {
    const userId = Controller.session(ctx).user.id
    if (!userId) {
      return await Controller.render(ctx, 'views/internal/not-authorized.ejs')
    }
    if ((await Controller.app.service('api/posts').get(postId)).userId !== userId) {
      throw new Error('This post does not belong to current user')
    }
    return userId
  }
}

export default new PostController()
