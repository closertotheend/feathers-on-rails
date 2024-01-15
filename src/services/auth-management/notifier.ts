import { Application } from '../../declarations'
import { User } from '../users/users.class'

export const notifier = (app: Application) => {
  async function sendEmail(email: any) {
    try {
      console.log('Sending email:', email)
      const result = await app.service('api/mailer').create(email)
      console.log('Email send result:', result)
      return result
    } catch (err) {
      console.error(err)
    }
  }

  return (type: string, user: User, notifierOptions = {}) => {
    if (type === 'resendVerifySignup') {
      return sendEmail({
        from: 'test@localhost',
        to: user.email,
        subject: 'Please confirm your e-mail address',
        text: 'Click here: ' + 'http://localhost:3030/verify?token=' + user.verifyToken
      })
    } else if (type === 'verifySignup') {
      return sendEmail({
        from: 'test@localhost',
        to: user.email,
        subject: 'E-Mail address verified',
        text: 'Registration process complete. Thanks for joining us!'
      })
    } else if (type === 'sendResetPwd') {
      return sendEmail({
        from: 'test@localhost',
        to: user.email,
        subject: 'Password reset link',
        text: 'http://localhost:3030/new-password?token=' + user.resetToken
      })
    }
  }
}
