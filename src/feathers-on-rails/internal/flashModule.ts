import { Application } from '../../declarations'
//@ts-ignore
import flash from 'koa-better-flash'

export const flashModule = (app: Application) => {
  app.use(flash())
}
