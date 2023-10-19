import { AuthenticationManagementService } from 'feathers-authentication-management'
import { Application } from '../../declarations'
import { notifier } from './notifier'

export const authManagement = (app: Application) => {
  app.use(
    'auth-management',
    new AuthenticationManagementService(app, {
        //@ts-ignore
      notifier: notifier(app)
    })
  )
}

declare module '../../declarations' {
  interface ServiceTypes {
    'auth-management': AuthenticationManagementService
  }
}
