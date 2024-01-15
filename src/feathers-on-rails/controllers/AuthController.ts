import { ParameterizedContext } from 'koa'
import { Framework, render, flash, redirect, session } from '../internal'
import { app } from '../../app'

class AuthController {
  async profile(ctx: ParameterizedContext) {
    if (!Framework.User.getUserId(ctx)) {
      redirect(ctx, '/login')
    }
    await render(ctx, 'views/profile/profile.ejs')
  }

  async changePassword(ctx: ParameterizedContext) {
    if (!Framework.User.getUserId(ctx)) {
      return await render(ctx, 'views/internal/not-authorized.ejs')
    }
    await app.service('api/auth-management').create({
      action: 'passwordChange',
      value: {
        oldPassword: ctx.request.body.oldPassword,
        password: ctx.request.body.password,
        user: { email: session(ctx).user.email }
      }
    })
    flash(ctx).set('info', 'Password changed')
    redirect(ctx, '/profile')
  }

  async login(ctx: ParameterizedContext) {
    await render(ctx, 'views/login/login.ejs')
  }

  async performLogin(ctx: ParameterizedContext) {
    try {
      const authResult = await app.service('api/authentication').create({
        strategy: 'local',
        email: ctx.request.body.email,
        password: ctx.request.body.password
      })
      const localSession = session(ctx)
      localSession.user = authResult.user
      localSession.authResult = authResult
      flash(ctx).set('info', 'Login was successful')
    } catch (e: any) {
      flash(ctx).set('warn', 'Login was unsuccessful: ' + e.message)
    }
    await redirect(ctx, '/posts/my')
  }

  async signup(ctx: ParameterizedContext) {
    await render(ctx, 'views/signup/signup.ejs')
  }

  async performSignup(ctx: ParameterizedContext) {
    const userAlreadyPresent =
      (
        await app.service('api/users').find({
          query: {
            email: ctx.request.body.email
          }
        })
      ).total > 0

    if (userAlreadyPresent) {
      flash(ctx).set('warn', 'User with such email already present')
      return await redirect(ctx, '/signup')
    }

    await app.service('api/users').create({
      email: ctx.request.body.email,
      password: ctx.request.body.password
    })

    flash(ctx).set('info', 'Please check dev console or email for verify link')
    await render(ctx, 'views/signup/signup.ejs')
  }

  async logout(ctx: ParameterizedContext) {
    const sessionLocal = session(ctx)

    if (!sessionLocal.authResult) {
      flash(ctx).set('warn', 'Nobody were logged in')
      redirect(ctx, '/')
    }

    try {
      await app.service('api/authentication').remove(null, {
        authentication: {
          accessToken: sessionLocal.authResult.accessToken,
          strategy: 'jwt'
        }
      })
    } finally {
      delete sessionLocal.authResult
      delete sessionLocal.user

      flash(ctx).set('info', 'Logged out')
      redirect(ctx, '/')
    }
  }

  async forgotPassword(ctx: ParameterizedContext) {
    await render(ctx, 'views/forgot-password/forgot-password.ejs')
  }

  async restorePassword(ctx: ParameterizedContext) {
    try {
      const email = ctx.request.body.email
      await app.service('api/auth-management').create({
        action: 'sendResetPwd',
        value: {
          email
        }
      })
      flash(ctx).set('warn', 'Check email or console')
    } catch (e: any) {
      flash(ctx).set('error', 'Fail: ' + e.message)
    }
    await render(ctx, 'views/forgot-password/forgot-password.ejs')
  }

  async newPassword(ctx: ParameterizedContext) {
    flash(ctx).set('info', 'Please set new password')
    await render(ctx, 'views/new-password/new-password.ejs', { token: ctx.query.token })
  }

  async confirmNewPassword(ctx: ParameterizedContext) {
    const { token, password } = ctx.request.body
    await app.service('api/auth-management').resetPasswordLong({ password, token })
    flash(ctx).set('info', 'Reset was successful, please login with your new password')
    redirect(ctx, '/login')
  }

  async verify(ctx: ParameterizedContext) {
    await app.service('api/auth-management').verifySignupLong({ token: ctx.query.token as string })
    flash(ctx).set('success', 'Successfully verified')
    redirect(ctx, '/login')
  }
}

export default new AuthController()
