import Youch from 'youch'
//@ts-ignore
import forTerminal from 'youch-terminal'
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
    } catch (err: any) {
      const youch = new Youch(err, ctx)

      if (err.path.indexOf('.ejs') > 0) {
        err.message = 'EJS fail: at' + err.path + ' at line ' + err.message
      }

      const output = await youch.toJSON()
      console.log(forTerminal(output))

      //@ts-ignore
      const html = await youch.toHTML()
      ctx.body = html
    }
  })
}
