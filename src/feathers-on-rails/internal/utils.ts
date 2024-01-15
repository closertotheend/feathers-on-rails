import _ from 'lodash'
import * as dateFns from 'date-fns'

type RenderType = (filename: string, templateArgs?: any) => Promise<any>

export const Utils: { [arg: string]: any } = {
  ejs: null as unknown as RenderType,
  _,
  dateFns,
  globalsToAddToTemplates: { _, dateFns },
  ctxGlobalsToAddToTemplates: {},
  stringifyWithFn: (obj: any) =>
    JSON.stringify(
      obj,
      function (key, val) {
        if (typeof val === 'function') {
          return val + '' // implicitly `toString` it
        }
        return val
      },
      4
    )
}
