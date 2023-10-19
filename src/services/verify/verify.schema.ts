// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { VerifyService } from './verify.class'

// Main data model schema
export const verifySchema = {
  $id: 'Verify',
  type: 'object',
  additionalProperties: false,
  properties: {
    token: {type: 'string'}
  }
} as const
export type Verify = FromSchema<typeof verifySchema>
export const verifyValidator = getValidator(verifySchema, dataValidator)
export const verifyResolver = resolve<Verify, HookContext<VerifyService>>({})

export const verifyExternalResolver = resolve<Verify, HookContext<VerifyService>>({})

// Schema for creating new data
export const verifyDataSchema = {
  $id: 'VerifyData',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...verifySchema.properties
  }
} as const
export type VerifyData = FromSchema<typeof verifyDataSchema>
export const verifyDataValidator = getValidator(verifyDataSchema, dataValidator)
export const verifyDataResolver = resolve<VerifyData, HookContext<VerifyService>>({})

// Schema for updating existing data
export const verifyPatchSchema = {
  $id: 'VerifyPatch',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...verifySchema.properties
  }
} as const
export type VerifyPatch = FromSchema<typeof verifyPatchSchema>
export const verifyPatchValidator = getValidator(verifyPatchSchema, dataValidator)
export const verifyPatchResolver = resolve<VerifyPatch, HookContext<VerifyService>>({})

// Schema for allowed query properties
export const verifyQuerySchema = {
  $id: 'VerifyQuery',
  type: 'object',
  properties: {
    token: {type: ['string']}
  }
} as const
export type VerifyQuery = FromSchema<typeof verifyQuerySchema>
export const verifyQueryValidator = getValidator(verifyQuerySchema, queryValidator)
export const verifyQueryResolver = resolve<VerifyQuery, HookContext<VerifyService>>({})
