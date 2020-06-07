import define from './define'

let host
if (define.DEBUG) {
    host = define.IS_LOCAL ? define.LOCAL_HOST : define.DEBUG_HOST
} else {
    host = define.HOST
}

// 配置项目中使用的接口
export default {
    login: `${host}${define.LOGIN_API}`
}
