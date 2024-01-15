// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  userDataValidator,
  userPatchValidator,
  userQueryValidator,
  userResolver,
  userExternalResolver,
  userDataResolver,
  userPatchResolver,
  userQueryResolver
} from './users.schema'

import type { Application } from '../../declarations'
import { UserService, getOptions } from './users.class'
import { userPath, userMethods } from './users.shared'
import { addVerification, removeVerification } from 'feathers-authentication-management'
import { notifier } from '../auth-management/notifier'
import { disallow } from 'feathers-hooks-common'

export * from './users.class'
export * from './users.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const user = (app: Application) => {
  const sendVerify = () => {
    return async (context: any) => {
      const notifierInstance = notifier(context.app)
      const users = Array.isArray(context.result) ? context.result : [context.result]
      await Promise.all(users.map(async (user: any) => notifierInstance('resendVerifySignup', user)))
    }
  }

  // Register our service on the Feathers application
  app.use(userPath, new UserService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: userMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  const hackyFixHook = (context: any) => {
    delete context.data[1]
    delete context.data[0]
  }
  // Initialize hooks
  app.service(userPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(userExternalResolver), schemaHooks.resolveResult(userResolver)],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    before: {
      all: [
        disallow('external'),
        schemaHooks.validateQuery(userQueryValidator),
        schemaHooks.resolveQuery(userQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(userDataValidator),
        schemaHooks.resolveData(userDataResolver),
        addVerification('api/auth-management')
      ],
      patch: [
        hackyFixHook,
        schemaHooks.validateData(userPatchValidator),
        schemaHooks.resolveData(userPatchResolver)
      ],
      remove: []
    },
    after: {
      all: [],
      create: [sendVerify(), removeVerification()]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [userPath]: UserService
  }
}
