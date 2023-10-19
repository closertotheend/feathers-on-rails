import * as ejs from 'ejs'
import * as path from 'path'

export const renderModule = (globalOptionsOverride?: any) => {
  const globalOptions = {
    cache: false,
    debug: false,
    ...globalOptionsOverride
  }

  const render = async (fileName: string, data?: any) => {
    return await ejs.renderFile(
      path.join(path.resolve('./src/feathers-on-rails'), fileName),
      data,
      globalOptions
    )
  }

  return { ejs, render }
}
