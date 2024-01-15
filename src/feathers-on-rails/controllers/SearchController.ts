import { ParameterizedContext } from 'koa'
import { render } from '../internal'
import { app } from '../../app'

class SearchController {
  async search(ctx: ParameterizedContext) {
    const searchTerm = ctx.query.term
    const posts = await app.service('api/posts').find({
      query: { $or: [{ heading: { $like: `%${searchTerm}%` } }, { text: { $like: `%${searchTerm}%` } }] },
      paginate: false
    })
    await render(ctx, 'views/search/search.ejs', { searchTerm, posts })
  }
}

export default new SearchController()
