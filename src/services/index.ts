import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'
import { authManagement } from './auth-management/auth-management'
import { mailerService } from './mailer/mailer'
import { verify } from './verify/verify'

export const services = (app: Application) => {
  app.configure(user)
  app.configure(mailerService)
  app.configure(authManagement)
  app.configure(verify)
  // All services will be registered here
}
