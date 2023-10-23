import { ParameterizedContext } from 'koa'
import { Controller as Controller } from '../internal/Controller'
import { logger } from '../../logger'

class AuthController extends Controller {
  async login(ctx: ParameterizedContext) {
    await Controller.html(ctx, 'views/login/login.ejs')
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
    } catch (e) {
      logger.info('failed to login' + e)
      Controller.flash(ctx).set('warn', 'Login was unsuccessful ' + e)
    }
    Controller.flash(ctx).set('info', 'Login was successful')
    await Controller.html(ctx, 'views/login/login.ejs')
  }

  async signup(ctx: ParameterizedContext) {
    await Controller.html(ctx, 'views/signup/signup.ejs')
  }

  async performSignup(ctx: ParameterizedContext) {
    await Controller.app.service('api/users').create({
      email: ctx.request.body.email,
      password: ctx.request.body.password
    })

    Controller.flash(ctx).set('info', 'Please check dev console or email for verify link')
    await Controller.html(ctx, 'views/signup/signup.ejs')
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
