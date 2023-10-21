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
    } catch (err) {
      const youch = new Youch(err, ctx)

      const options = {
        // Defaults to false
        displayShortPath: false,

        // Defaults to single whitspace
        prefix: ' ',

        // Defaults to false
        hideErrorTitle: false,

        // Defaults to false
        hideMessage: false,

        // Defaults to false
        displayMainFrameOnly: false,

        // Defaults to 3
        framesMaxLimit: 3
      }

      const output = await youch.toJSON()
      console.log(forTerminal(output, options))

      //@ts-ignore
      const html = await youch.toHTML()
      ctx.body = html
    }
  })
}
