import Router from '@koa/router'
import { Application } from '../../declarations'
import { configureRoutes } from '../router'
import { Controller } from './Controller'
import { renderModule } from './renderModule'
import { youchModule } from './errorHandlerModule'
import { flashModule } from './flashModule'

export const framework = (app: Application) => {
  app.configure(youchModule)
  app.configure(flashModule)

  const ejsLoaded = renderModule()
  Controller.render = ejsLoaded.render
  Controller.app = app

  const router = new Router()
  configureRoutes(router)
  app.use(router.routes()).use(router.allowedMethods())
}
