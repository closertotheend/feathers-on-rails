import { ParameterizedContext } from 'koa'
import { Framework, render, flash, redirect, session } from '../internal'
import { app } from '../../app'

class PostController {
  async new(ctx: ParameterizedContext) {
    const userId = Framework.User.getUserId(ctx)
    if (!userId) {
      return await render(ctx, 'views/internal/not-authorized.ejs')
    }
    await render(ctx, 'views/posts/new.ejs')
  }

  async create(ctx: ParameterizedContext) {
    const userId = Framework.User.getUserId(ctx)
    if (!userId) {
      return await render(ctx, 'views/internal/not-authorized.ejs')
    }
    const post = await app.service('api/posts').create({ ...ctx.request.body, userId } as any)
    flash(ctx).set('info', 'Post created')
    redirect(ctx, '/posts/' + post.id)
  }

  async myPosts(ctx: ParameterizedContext) {
    const userId = Framework.User.getUserId(ctx)
    if (!userId) {
      return await render(ctx, 'views/internal/not-authorized.ejs')
    }
    const posts = await app.service('api/posts').find({ query: { userId }, paginate: false })
    await render(ctx, 'views/posts/my.ejs', { posts })
  }

  async show(ctx: ParameterizedContext) {
    const postId = ctx.params.id
    const post = await app.service('api/posts').get(postId)
    await render(ctx, 'views/posts/show.ejs', {
      post,
      postBelongsToCurrentUser: session(ctx).user?.id === post.userId
    })
  }

  async edit(ctx: ParameterizedContext) {
    const postId = ctx.params.id
    const userId = await this.checkCorrectUserAccessing(postId, ctx)
    const post = await app.service('api/posts').get(postId)
    await render(ctx, 'views/posts/edit.ejs', {
      post,
      postBelongsToCurrentUser: userId === post.userId
    })
  }

  async update(ctx: ParameterizedContext) {
    const postId = ctx.params.id
    await this.checkCorrectUserAccessing(postId, ctx)
    await app.service('api/posts').patch(postId, ctx.request.body)
    flash(ctx).set('info', 'Post updated')
    redirect(ctx, '/posts/' + postId)
  }

  async remove(ctx: ParameterizedContext) {
    const postId = ctx.params.id
    await this.checkCorrectUserAccessing(postId, ctx)
    await app.service('api/posts').remove(postId)
    flash(ctx).set('info', 'Post removed')
    ctx.set('HX-Redirect', '/')
  }

  private async checkCorrectUserAccessing(postId: number, ctx: ParameterizedContext) {
    const userId = Framework.User.getUserId(ctx)
    if (!userId) {
      return await render(ctx, 'views/internal/not-authorized.ejs')
    }
    if ((await app.service('api/posts').get(postId)).userId !== userId) {
      throw new Error('This post does not belong to current user')
    }
    return userId
  }
}

export default new PostController()
