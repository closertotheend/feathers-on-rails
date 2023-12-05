import { ParameterizedContext } from 'koa'
import { Controller as Controller } from '../internal/Controller'
import { logger } from '../../logger'
import { user } from '../../services/users/users'

class AuthController extends Controller {
  async profile(ctx: ParameterizedContext) {
    const userId = Controller.session(ctx).user?.id
    if (!userId) {
      Controller.redirect(ctx, '/login')
    }
    await Controller.render(ctx, 'views/profile/profile.ejs')
  }

  async changePassword(ctx: ParameterizedContext) {
    const userId = Controller.session(ctx).user.id
    if (!userId) {
      return await Controller.render(ctx, 'views/internal/not-authorized.ejs')
    }
    await Controller.app.service('api/auth-management').create({
      action: 'passwordChange',
      value: {
        oldPassword: ctx.request.body.oldPassword,
        password: ctx.request.body.password,
        user: { email: Controller.session(ctx).user.email }
      }
    })
    Controller.flash(ctx).set('info', 'Password changed')
    Controller.redirect(ctx, '/profile')
  }

  async login(ctx: ParameterizedContext) {
    await Controller.render(ctx, 'views/login/login.ejs')
  }

  async performLogin(ctx: ParameterizedContext) {
    try {
      const authResult = await Controller.app.service('api/authentication').create({
        strategy: 'local',
        email: ctx.request.body.email,
        password: ctx.request.body.password
      })
      const session = Controller.session(ctx)
      session.user = authResult.user
      session.authResult = authResult
      Controller.flash(ctx).set('info', 'Login was successful')
    } catch (e) {
      logger.info('failed to login' + e)
      Controller.flash(ctx).set('warn', 'Login was unsuccessful ' + e)
    }
    await Controller.render(ctx, 'views/login/login.ejs')
  }

  async signup(ctx: ParameterizedContext) {
    await Controller.render(ctx, 'views/signup/signup.ejs')
  }

  async performSignup(ctx: ParameterizedContext) {
    const userAlreadyPresent =
      (
        await Controller.app.service('api/users').find({
          query: {
            email: ctx.request.body.email
          }
        })
      ).total > 0

    if (userAlreadyPresent) {
      Controller.flash(ctx).set('warn', 'User with such email already present')
      return await Controller.redirect(ctx, '/signup')
    }

    await Controller.app.service('api/users').create({
      email: ctx.request.body.email,
      password: ctx.request.body.password
    })

    Controller.flash(ctx).set('info', 'Please check dev console or email for verify link')
    await Controller.render(ctx, 'views/signup/signup.ejs')
  }

  async logout(ctx: ParameterizedContext) {
    const session = Controller.session(ctx)

    if (!session.authResult) {
      Controller.flash(ctx).set('warn', 'Nobody were logged in')
      Controller.redirect(ctx, '/')
    }

    try {
      await Controller.app.service('api/authentication').remove(null, {
        authentication: {
          accessToken: session.authResult.accessToken,
          strategy: 'jwt'
        }
      })
    } finally {
      delete session.authResult
      delete session.user

      Controller.flash(ctx).set('info', 'Logged out')
      Controller.redirect(ctx, '/')
    }
  }
}

export default new AuthController()
