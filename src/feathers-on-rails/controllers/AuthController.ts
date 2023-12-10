import { ParameterizedContext } from 'koa'
import { Controller as Controller } from '../internal/Controller'

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
    } catch (e: any) {
      Controller.flash(ctx).set('warn', 'Login was unsuccessful: ' + e.message)
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

  async forgotPassword(ctx: ParameterizedContext) {
    await Controller.render(ctx, 'views/forgot-password/forgot-password.ejs')
  }

  async restorePassword(ctx: ParameterizedContext) {
    try {
      const email = ctx.request.body.email
      await Controller.app.service('api/auth-management').create({
        action: 'sendResetPwd',
        value: {
          email
        }
      })
      Controller.flash(ctx).set('warn', 'Check email or console')
    } catch (e: any) {
      Controller.flash(ctx).set('error', 'Fail: ' + e.message)
    }
    await Controller.render(ctx, 'views/forgot-password/forgot-password.ejs')
  }

  async newPassword(ctx: ParameterizedContext) {
    Controller.flash(ctx).set('info', 'Please set new password')
    await Controller.render(ctx, 'views/new-password/new-password.ejs', { token: ctx.query.token })
  }

  async confirmNewPassword(ctx: ParameterizedContext) {
    const { token, password } = ctx.request.body
    await Controller.app
      .service('api/auth-management')
      .resetPasswordLong({ password, token })
    Controller.flash(ctx).set('info', 'Reset was successful, please login with your new password')
    Controller.redirect(ctx, '/login')
  }

  async verify(ctx: ParameterizedContext) {
    await Controller.app
      .service('api/auth-management')
      .verifySignupLong({token: ctx.query.token as string})
    Controller.flash(ctx).set('success', 'Successfully verified')
    Controller.redirect(ctx, '/login')
  }
}

export default new AuthController()
