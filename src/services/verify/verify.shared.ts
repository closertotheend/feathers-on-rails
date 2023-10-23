// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Verify, VerifyData, VerifyPatch, VerifyQuery, VerifyService } from './verify.class'

export type { Verify, VerifyData, VerifyPatch, VerifyQuery }

export type VerifyClientService = Pick<VerifyService<Params<VerifyQuery>>, (typeof verifyMethods)[number]>

export const verifyPath = 'api/verify'

export const verifyMethods = ['find'] as const

export const verifyClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(verifyPath, connection.service(verifyPath), {
    methods: verifyMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [verifyPath]: VerifyClientService
  }
}
