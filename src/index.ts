import { app } from './app'
import { logger } from './logger'

const port = process.env.PORT || app.get('port')
const host = process.env.HOST || app.get('host')

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

app.listen(port).then(() => {
  logger.info(`Feathers app listening on http://${host}:${port}`)
})
