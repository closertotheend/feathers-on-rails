import { Application } from '../../declarations'
import { User } from '../users/users.class'

export const notifier = (app: Application) => {
  function getLink(type:string, hash:string | undefined | null) {
    return 'http://localhost:3030/' + type + '?token=' + hash
  }

  async function sendEmail(email: any) {
    try {
      console.log(email)
      const result = await app.service('mailer').create(email)
      console.log('EMAIL result:')
      console.log(result)
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
        text: 'Click here: ' + getLink('verify', user.verifyToken)
      })
    } else if (type === 'verifySignup') {
      return sendEmail({
        from: 'test@localhost',
        to: user.email,
        subject: 'E-Mail address verified',
        text: 'Registration process complete. Thanks for joining us!'
      })
    }
  }
}
