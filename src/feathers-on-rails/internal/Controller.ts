import { Application, ServiceTypes } from '../../declarations'
import { ParameterizedContext } from 'koa'

type RenderType = (filename: string, templateArgs?: any) => Promise<any>

export class Controller {
  static ejsRender: RenderType
  static app: Application

  static session = (ctx: ParameterizedContext) => {
    if(!ctx.session){
      throw new Error('No session')
    }
    return ctx.session;
  }

  static flash = (ctx: ParameterizedContext) => ({
    set: (flashKey: string, stringOrStringArr: string | string[]) => {
      ctx.flash(flashKey, stringOrStringArr)
    },
    get: () => {
      return ctx.flash()
    }
  })

  static async render(ctx: ParameterizedContext, fileName: string, templateArgs?: any) {
    ctx.body = await Controller.ejsRender(fileName, {
      ...templateArgs,
      global: { session: Controller.session(ctx), flash: ctx.flash() }
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
