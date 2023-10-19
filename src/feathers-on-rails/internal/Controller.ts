import { Application } from '../../declarations'
import { ParameterizedContext } from 'koa'

type RenderType = (filename: string, templateArgs?: any) => Promise<any>

export class Controller {
  static render: RenderType
  static app: Application

  static session = (ctx: ParameterizedContext) => ({
    set: (sessionKey: string, obj: any) => {
      //@ts-ignore
      ctx.session[sessionKey] = obj
    },
    get: (sessionKey?: string) => {
      if (sessionKey) {
        //@ts-ignore
        return ctx.session[sessionKey]
      }
      return ctx.session
    }
  })

  static flash = (ctx: ParameterizedContext) => ({
    set: (flashKey: string, stringOrStringArr: string | string[]) => {
      ctx.flash(flashKey, stringOrStringArr)
    },
    get: (flashKey?: string) => {
      if (flashKey) {
        return ctx.flash(flashKey)
      }
      return ctx.flash()
    }
  })

  static async html(ctx: ParameterizedContext, fileName: string, templateArgs?: any) {
    ctx.body = await Controller.render(fileName, {
      templateArgs,
      global: { session: Controller.session(ctx).get(), flash: ctx.flash() }
    })
  }

  static json(ctx: ParameterizedContext, jsonObject: any) {
    ctx.body = jsonObject
  }

  static redirect(ctx: ParameterizedContext, url: string) {
    ctx.redirect(url)
  }

  setLocale(ctx: ParameterizedContext, lang: string) {
    ctx.cookies.set('locale', lang)
  }
}
