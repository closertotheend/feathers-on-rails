import Router from '@koa/router'
import { Application } from '../../declarations'
import { configureRoutes } from '../router'
import { Controller } from './Controller'
import { renderModule } from './renderModule'
import { youchModule } from './errorHandlerModule'
import { flashModule } from './flashModule'
import { sessionModule } from './sessionModulte'
import { Support } from './Support'

export const framework = (app: Application) => {
  app.configure(sessionModule)
  app.configure(youchModule)
  app.configure(flashModule)

  const ejsLoaded = renderModule()

  Support.ejs = ejsLoaded.render
  Controller.app = app

  const router = new Router()
  configureRoutes(router)
  app.use(router.routes()).use(router.allowedMethods())
}
