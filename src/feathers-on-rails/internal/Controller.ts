import { Application } from '../../declarations'
import { ParameterizedContext } from 'koa'
import { Support } from './Support'

export class Controller {
  static app: Application

  static session = (ctx: ParameterizedContext) => {
    if (!ctx.session) {
      throw new Error('No session')
    }
    return ctx.session
  }

  static flash = (ctx: ParameterizedContext) => ({
    set: (flashKey: string, stringOrStringArr: string | string[]) => {
      ctx.flash(flashKey, stringOrStringArr)
    },
    get: () => {
      return ctx.flash()
    }
  })

  static async render(ctx: ParameterizedContext, fileName: string, templateArgs: any = {}) {
    const global = {
      ...Support.globalsToAdd,
      session: Controller.session(ctx),
      flash: Controller.flash(ctx).get(),
      debug: () => Support.stringifyWIthFn(this)
    }
    templateArgs.global = global
    ctx.body = await Support.ejs(fileName, templateArgs)
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
