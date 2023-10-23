import mailer, { Service } from 'feathers-mailer'
import nodemailer from 'nodemailer'
import { Application } from '../../declarations'

export const mailerService = async (app: Application) => {
  const account = await nodemailer.createTestAccount() // internet required

  const transporter = {
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure, // 487 only
    requireTLS: true,
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
    }
  }

  // Register service and setting default From Email
  app.use('api/mailer', mailer(transporter, { from: account.user }))
}

declare module '../../declarations' {
  interface ServiceTypes {
    'api/mailer': Service
  }
}
