import { AuthenticationManagementService } from 'feathers-authentication-management'
import { Application } from '../../declarations'
import { notifier } from './notifier'

export const authManagement = (app: Application) => {
  app.use(
    'api/auth-management',
    new AuthenticationManagementService(app, {
      //@ts-ignore
      notifier: notifier(app),
      service: 'api/users'
    })
  )
}

declare module '../../declarations' {
  interface ServiceTypes {
    'api/auth-management': AuthenticationManagementService
  }
}
