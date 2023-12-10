import { ParameterizedContext } from 'koa'
import { Utils } from './utils'

const Core = {
  session: (ctx: ParameterizedContext) => {
    if (!ctx.session) {
      throw new Error('No session')
    }
    return ctx.session
  },

  flash: (ctx: ParameterizedContext) => ({
    set: (flashKey: string, stringOrStringArr: string | string[]) => {
      ctx.flash(flashKey, stringOrStringArr)
    },
    get: () => {
      return ctx.flash()
    }
  }),

  render: async (ctx: ParameterizedContext, fileName: string, templateArgs: any = {}) => {
    templateArgs.global = {
      ...Utils.globalsToAddToTemplates,
      session: Framework.session(ctx),
      flash: Framework.flash(ctx).get(),
      debug: () => Utils.stringifyWithFn(this)
    }
    ctx.body = await Utils.ejs(fileName, templateArgs)
  },

  json: (ctx: ParameterizedContext, jsonObject: any) => {
    ctx.body = jsonObject
  },

  redirect: (ctx: ParameterizedContext, url: string) => {
    ctx.redirect(url)
  }
}

const Locale = {
  setLocale: (ctx: ParameterizedContext, lang: string) => {
    ctx.cookies.set('locale', lang)
  }
}

export const Framework = {
  ...Core,
  ...Locale
}

export * from './utils';
