import { Controller } from '../internal/Controller'
import { ParameterizedContext } from 'koa'

class SearchController extends Controller {
  async search(ctx: ParameterizedContext) {
    const searchTerm = ctx.query.term
    const posts = await Controller.app
      .service('api/posts')
      .find({
        query: { $or: [{ heading: { $like: `%${searchTerm}%` } }, { text: { $like: `%${searchTerm}%` } }] },
        paginate: false
      })
    await Controller.render(ctx, 'views/search/search.ejs', { searchTerm, posts })
  }
}

export default new SearchController()
