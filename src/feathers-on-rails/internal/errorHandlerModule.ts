import Youch from 'youch'
import { Application } from '../../declarations'

export const youchModule = (app: Application) => {
  app.use(async (ctx, next) => {
    try {
      await next()
      if (ctx.status === 404) {
        const youch = new Youch(ctx, ctx)
        //@ts-ignore
        const html = await youch.toHTML()
        ctx.body = html
      }
    } catch (err) {
      const youch = new Youch(err, ctx)
      //@ts-ignore
      const html = await youch.toHTML()
      ctx.body = html
    }
  })
}
