import { ParameterizedContext } from 'koa'
import { Utils } from './utils'
import Router from '@koa/router'
import { Application } from '../../declarations'
import { configureRoutes } from '../router'
import { renderModule } from './renderModule'
import { youchModule } from './errorHandlerModule'
import { flashModule } from './flashModule'
import { sessionModule } from './sessionModulte'
import i18next from 'i18next'

export const session = (ctx: ParameterizedContext) => {
  if (!ctx.session) {
    throw new Error('No session')
  }
  return ctx.session
}

export const flash = (ctx: ParameterizedContext) => ({
  set: (flashKey: string, stringOrStringArr: string | string[]) => {
    ctx.flash(flashKey, stringOrStringArr)
  },
  get: () => {
    return ctx.flash()
  }
})

export const render = async (ctx: ParameterizedContext, fileName: string, templateArgs: any = {}) => {
  const ctxGlobalsToAddToTemplatesResult = {}
  Object.values(Utils.ctxGlobalsToAddToTemplates)
    .map((it: any) => it(ctx))
    .forEach((obj) => Object.assign(ctxGlobalsToAddToTemplatesResult, obj))
  templateArgs.global = {
    ...ctxGlobalsToAddToTemplatesResult,
    ...Utils.globalsToAddToTemplates,
    session: Core.session(ctx),
    flash: Core.flash(ctx).get(),
    debug: () => Utils.stringifyWithFn(templateArgs)
  }
  ctx.body = await Utils.ejs(fileName, templateArgs)
}

export const json = async (ctx: ParameterizedContext, fileName: string, templateArgs: any = {}) => {
  templateArgs.global = {
    ...Utils.globalsToAddToTemplates,
    session: Core.session(ctx),
    flash: Core.flash(ctx).get(),
    debug: () => Utils.stringifyWithFn(templateArgs)
  }
  ctx.body = await Utils.ejs(fileName, templateArgs)
}

export const redirect = (ctx: ParameterizedContext, url: string) => {
  ctx.redirect(url)
}

const Core = {
  init: (app: Application) => {
    app.configure(sessionModule)
    app.configure(youchModule)
    app.configure(flashModule)

    const ejsLoaded = renderModule()

    Utils.ejs = ejsLoaded.render

    const router = new Router()
    configureRoutes(router)
    app.use(router.routes()).use(router.allowedMethods())
  },
  session,
  flash,
  render,
  json,
  redirect
}

const User = (core: typeof Core) => ({
  getUserId: (ctx: ParameterizedContext) => {
    return core.session(ctx).user?.id
  }
})

const Locale = (defaultLang: string) => {
  i18next.init({
    fallbackLng: defaultLang,
    lng: defaultLang, // if you're using a language detector, do not define the lng option
    resources: {
      en: {
        translation: {
          key: 'hello world'
        }
      },
      es: {
        translation: {
          key: 'hola'
        }
      }
    }
  })
  Utils.ctxGlobalsToAddToTemplates.i18next = (ctx: ParameterizedContext) => {
    const locale = ctx.cookies.get('locale')
    i18next.changeLanguage(locale || defaultLang)
    return { i18next }
  }
  const openMethods = {
    getLocale: (ctx: ParameterizedContext, lang: string) => {
      return ctx.cookies.get('locale')
    },

    setLocale: (ctx: ParameterizedContext, lang: string) => {
      ctx.cookies.set('locale', lang)
      i18next.changeLanguage(lang)
    }
  }
  return openMethods
}

export const Framework = {
  Core,
  User: User(Core),
  Locale: Locale('en')
}
