// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { Verify, VerifyData, VerifyPatch, VerifyQuery } from './verify.schema'

export type { Verify, VerifyData, VerifyPatch, VerifyQuery }

export interface VerifyServiceOptions {
  app: Application
}

export interface VerifyParams extends Params<VerifyQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class VerifyService<ServiceParams extends VerifyParams = VerifyParams>
  implements ServiceInterface<Verify, VerifyData, ServiceParams, VerifyPatch>
{
  constructor(public options: VerifyServiceOptions) {}

  async find(_params?: ServiceParams): Promise<any> {
    const token = _params!.query!.token!
    const authManagement = this.options.app.service('auth-management')
    const result = await authManagement.verifySignupLong({
      token, // compares to .verifyToken
    })
    return result
  }

}

export const getOptions = (app: Application) => {
  return { app }
}
