import _ from 'lodash'
import * as dateFns from 'date-fns'

type RenderType = (filename: string, templateArgs?: any) => Promise<any>

export class Support {
  static ejs: RenderType
  static _ = _
  static dateFns = dateFns
  static globalsToAdd = { _, dateFns }
  static stringifyWithFn = (obj: any) =>
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
