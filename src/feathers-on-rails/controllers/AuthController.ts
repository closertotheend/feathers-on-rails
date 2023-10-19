import { ParameterizedContext } from 'koa'
import { Controller } from '../internal/Controller'
import { logger } from '../../logger'

class AuthController extends Controller {
  async login(ctx: ParameterizedContext) {
    await Controller.html(ctx, 'views/login/login.ejs')
  }

  async performLogin(ctx: ParameterizedContext) {
    try {
      const authResult = await Controller.app.service('authentication').create({
        strategy: 'local',
        email: ctx.request.body.email,
        password: ctx.request.body.password
      })
      Controller.session(ctx).set('user', authResult.user)
    } catch (e) {
      logger.info('failed to login' + e)
      Controller.flash(ctx).set('warn', 'Login was unsuccessful')
    }
    Controller.flash(ctx).set('info', 'Login was successful')
    await Controller.html(ctx, 'views/login/login.ejs')
  }

  async signup(ctx: ParameterizedContext) {
    await Controller.html(ctx, 'views/signup/signup.ejs')
  }

  async performSignup(ctx: ParameterizedContext) {
    await Controller.app.service('users').create({
      email: ctx.request.body.email,
      password: ctx.request.body.password
    })
    Controller.flash(ctx).set('info', 'Please check dev console or email for verify link')
    await Controller.html(ctx, 'views/signup/signup.ejs')
  }

  async logout(ctx: ParameterizedContext) {
    ctx.cookies.set('test', '123123')
    const app = Controller.app
    const newLocal = Controller.session(ctx).get('accessToken')
    await app.service('authentication').remove(null, {
      authentication: {
        accessToken: newLocal,
        strategy: 'jwt'
      }
    });
    Controller.flash(ctx).set('info', 'Logged out')
    Controller.redirect(ctx, '/')
  }
}

export default new AuthController()
