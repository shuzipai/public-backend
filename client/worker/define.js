

export default {
  // 系统名称
  SYSTEM_NAME: '通用后台管理系统',
  // 调试模式 设置为true则根据IS_LOCAL使用不同的域名
  DEBUG: false,
  // 本地调试模式
  IS_LOCAL: false,
  // 正式环境域名 不要末尾的'/'
  HOST: 'https://ai-inner-test.kingdomai.com/api/ainews-user-v1',
  // 测试环境域名
  DEBUG_HOST: 'https://ai-inner-test.kingdomai.com/api/ainews-user',
  // 本地环境域名
  LOCAL_HOST: 'http://127.0.0.1:3000', // http://123.56.138.96:3016
  // 登录接口
  LOGIN_API: '/user/login',
  // 是否使用默认路由 开启以后会根据schema生成一个通用路由
  USE_DEFAULT_ROUTE: true,
  // 设置菜单/路由
  ROUTE: [{
    name: '这是一个自定义的路由',
    // 如果存在children 则显示多级路由
    children: [{
      name: '一级项'
    }] 
  }]
}
