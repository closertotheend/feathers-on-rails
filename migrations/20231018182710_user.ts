// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('email').unique()
    table.string('password')
    table.string('googleId')
    table.string('facebookId')
    table.string('twitterId')
    table.string('githubId')
    table.string('auth0Id')
    table.boolean('isVerified')
    table.string('verifyToken')
    table.string('verifyShortToken')
    table.integer('verifyExpires')
    table.string('verifyChanges')
    table.integer('resetExpires')
    table.integer('resetAttempts')
    table.string('resetToken')
    table.string('resetShortToken')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
