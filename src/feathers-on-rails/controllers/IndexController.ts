import { ParameterizedContext } from 'koa'
import { Controller } from '../internal/Controller'

class IndexController extends Controller {
  async index(ctx: ParameterizedContext) {
    const sixLatestPosts = (
      await Controller.app.service('api/posts').find({ query: { $sort: { id: -1 }, $limit: 6 } })
    ).data

    await Controller.render(ctx, 'views/home/index.ejs', {
      twoLatestPosts: sixLatestPosts.slice(0, 2),
      fourLatestPostsAfter2Latest: sixLatestPosts.slice(2, 6)
    })
  }

  async postsPage(ctx: ParameterizedContext) {
    const pageNr = parseInt(ctx.params.pageNr)
    const posts = (
      await Controller.app
        .service('api/posts')
        .find({ query: { $sort: { id: -1 }, $limit: 5, $skip: 6 * (pageNr - 1) } })
    ).data

    await Controller.render(ctx, 'views/posts/x-page.ejs', { nextPageNr: pageNr + 1, posts })
  }

  async redirect(ctx: ParameterizedContext) {
    Controller.flash(ctx).set('info', 'You have been redirected to main page')
    await Controller.redirect(ctx, '/')
  }
}

export default new IndexController()
