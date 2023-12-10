import Router from '@koa/router'
import { Application } from '../../declarations'
import { configureRoutes } from '../router'
import { renderModule } from './renderModule'
import { youchModule } from './errorHandlerModule'
import { flashModule } from './flashModule'
import { sessionModule } from './sessionModulte'
import { Utils } from './utils'

export const framework = (app: Application) => {
  app.configure(sessionModule)
  app.configure(youchModule)
  app.configure(flashModule)

  const ejsLoaded = renderModule()

  Utils.ejs = ejsLoaded.render

  const router = new Router()
  configureRoutes(router)
  app.use(router.routes()).use(router.allowedMethods())
}
