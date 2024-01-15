// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PostsService } from './posts.class'

// Main data model schema
export const postsSchema = {
  $id: 'Posts',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'text', 'userId'],
  properties: {
    id: { type: 'number' },
    heading: { type: 'string' },
    text: { type: 'string' },
    userId: { type: 'number' },
    userEmail: { type: 'string' },
    createdAt: { type: 'string' }
  }
} as const
export type Posts = FromSchema<typeof postsSchema>
export const postsValidator = getValidator(postsSchema, dataValidator)
export const postsResolver = resolve<Posts, HookContext<PostsService>>({
  userEmail: async (value, post, context) => {
    const user = await context.app.service('api/users').get(post.userId!)
    return user.email
  }
})

export const postsExternalResolver = resolve<Posts, HookContext<PostsService>>({})

// Schema for creating new data
export const postsDataSchema = {
  $id: 'PostsData',
  type: 'object',
  additionalProperties: false,
  required: ['heading', 'text', 'userId'],
  properties: {
    ...postsSchema.properties
  }
} as const
export type PostsData = FromSchema<typeof postsDataSchema>
export const postsDataValidator = getValidator(postsDataSchema, dataValidator)
export const postsDataResolver = resolve<PostsData, HookContext<PostsService>>({})

// Schema for updating existing data
export const postsPatchSchema = {
  $id: 'PostsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...postsSchema.properties
  }
} as const
export type PostsPatch = FromSchema<typeof postsPatchSchema>
export const postsPatchValidator = getValidator(postsPatchSchema, dataValidator)
export const postsPatchResolver = resolve<PostsPatch, HookContext<PostsService>>({})

// Schema for allowed query properties
export const postsQuerySchema = {
  $id: 'PostsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(postsSchema.properties),
    // $like query does not work otherwise :(
    heading: { type: ['string', 'object'] },
    text: { type: ['string', 'object'] },
    $or: { type: ['array'] }
  }
} as const
export type PostsQuery = FromSchema<typeof postsQuerySchema>
export const postsQueryValidator = getValidator(postsQuerySchema, queryValidator)
export const postsQueryResolver = resolve<PostsQuery, HookContext<PostsService>>({})
