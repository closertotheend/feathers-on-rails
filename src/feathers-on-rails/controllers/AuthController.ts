import { ParameterizedContext } from 'koa'
import { Controller as Controller } from '../internal/Controller'
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
      Controller.session(ctx).user = authResult.user)
      Controller.session(ctx).set('authResult', authResult)
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
    await Controller.app.service('users').create({
      email: ctx.request.body.email,
      password: ctx.request.body.password
    })
    Controller.flash(ctx).set('info', 'Please check dev console or email for verify link')
    await Controller.html(ctx, 'views/signup/signup.ejs')
  }

  async logout(ctx: ParameterizedContext) {
    const app = Controller.app
    const accessToken = ctx.cookies.get('koa.sess')
    Controller.session(ctx)
        //@ts-ignore
    const newLocal = ctx.session.authResult.accessToken
    // @ts-ignore
    ctx.session = {}
    await app.service('authentication').remove(null, {
      authentication: {
        //@ts-ignore
        accessToken: newLocal,
        strategy: 'jwt'
      }
    });
    Controller.flash(ctx).set('info', 'Logged out')
    Controller.redirect(ctx, '/')
  }
}

export default new AuthController()
