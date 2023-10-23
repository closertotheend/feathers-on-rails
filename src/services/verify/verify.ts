// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  verifyQueryValidator,
  verifyResolver,
  verifyExternalResolver,
  verifyQueryResolver
} from './verify.schema'

import type { Application } from '../../declarations'
import { VerifyService, getOptions } from './verify.class'
import { verifyPath, verifyMethods } from './verify.shared'

export * from './verify.class'
export * from './verify.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const verify = (app: Application) => {
  // Register our service on the Feathers application
  app.use(verifyPath, new VerifyService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: verifyMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(verifyPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(verifyExternalResolver), schemaHooks.resolveResult(verifyResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(verifyQueryValidator), schemaHooks.resolveQuery(verifyQueryResolver)],
      find: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [verifyPath]: VerifyService
  }
}
