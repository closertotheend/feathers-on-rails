import { ParameterizedContext } from 'koa'
import { Framework, render, flash, redirect } from '../internal'
import { app } from '../../app'

class IndexController {
  async index(ctx: ParameterizedContext) {
    const sixLatestPosts = (await app.service('api/posts').find({ query: { $sort: { id: -1 }, $limit: 6 } }))
      .data

    await render(ctx, 'views/home/index.ejs', {
      twoLatestPosts: sixLatestPosts.slice(0, 2),
      fourLatestPostsAfter2Latest: sixLatestPosts.slice(2, 6)
    })
  }

  async postsPage(ctx: ParameterizedContext) {
    const pageNr = parseInt(ctx.params.pageNr)
    const posts = (
      await app
        .service('api/posts')
        .find({ query: { $sort: { id: -1 }, $limit: 5, $skip: 6 * (pageNr - 1) } })
    ).data

    await render(ctx, 'views/posts/x-page.ejs', { nextPageNr: pageNr + 1, posts })
  }

  async changeLang(ctx: ParameterizedContext) {
    Framework.Locale.setLocale(ctx, ctx.params.lang)
    await redirect(ctx, '/')
  }

  async redirect(ctx: ParameterizedContext) {
    flash(ctx).set('info', 'You have been redirected to main page')
    await redirect(ctx, '/')
  }
}

export default new IndexController()
