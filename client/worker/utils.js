import moment from 'moment'
import define from './define'

/**
 * 暂时简单一点只是console[log/error/warn]的语法糖
 * 后期应该加入日志的反馈
 * 目前是为了统一输出
 * @param {*} level
 * @param {*} tripe
 */
function log(level, tripe) {
  if (['error', 'warn', 'log'].indexOf(level) === -1) {
    return console.warn("params[0] not indexOf ['error', 'warn', 'log']")
  }

  console[level](tripe)
}

function getMatchParams(props) {
  const { match } = props
  if (!match) {
    log('error', 'match is undefined')
    return {}
  }
  const { params } = match
  if (!params) {
    log('error', 'params is undefined')
    return {}
  }
  return params
}

function getHost() {
  if (define.DEBUG) {
    return define.IS_LOCAL ? define.LOCAL_HOST : define.DEBUG_HOST
  } else {
    return define.HOST
  }
}

function getQuery(url) {
  const query_obj = {}
  try {
    const query = url.substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      const key = pair[0]
      const value = decodeURIComponent(pair.slice(1, pair.length).join('='))
      if (!query_obj[key]) {
        query_obj[key] = value
      }
    }
  } catch (e) {
    console.warn(e)
  }
  return query_obj
}

function getSchemaApi(schema, name) {
  const { curd_api } = schema
  if (!curd_api || !curd_api[name]) {
    return `${getHost()}/${schema.router}/${name}`
  }
  return getHost() + curd_api[name]
}

function getLoginUrl() {
  return `${getHost()}${define.LOGIN_API}`
}

export default {
  log,
  getSchemaApi,
  getMatchParams,
  getLoginUrl,
  getQuery
}
