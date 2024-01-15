import { AuthenticationManagementService } from 'feathers-authentication-management'
import { Application } from '../../declarations'
import { notifier } from './notifier'
import { disallow } from 'feathers-hooks-common'

export const authManagement = (app: Application) => {
  app.use(
    'api/auth-management',
    new AuthenticationManagementService(app, {
      //@ts-ignore
      notifier: notifier(app),
      service: 'api/users'
    })
  )

  app.service('api/auth-management').hooks({
    before: {
      all: [disallow('external')]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    'api/auth-management': AuthenticationManagementService
  }
}
