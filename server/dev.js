/**
 * tzw 2017年8月29日14:32:23
 */
/*global module require */
/*eslint no-console: "off" */
// 严格模式
'use strict'

// 引入配置文件（系统基础配置）
const config = require('../config/app.config')

const fs = require('fs')
const path = require('path')
const opener = require('opener')

// Koa框架
const Koa = require('koa')

// Koa实例化出来一个application
const app = new Koa()

const webpack = require('webpack')
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware')

// 打包前端代码
const webpack_client_config = require(`${config.CONFIG_ROOT}/webpack.config.js`)
const client_compiler = webpack(webpack_client_config[1])

const Env = require('./middleware/nunjucksEnv')

const html = Env.render('index.html', {
  script_tags: '<script src="/chunk.vendor.js"></script><script src="/app.js"></script>',
})

// 在config.WEBPACK_CLIENT_ROOT里生成index.html
if (!fs.existsSync(config.WEBPACK_CLIENT_ROOT)) {
  fs.mkdirSync(config.WEBPACK_CLIENT_ROOT)
}
const index_writable = fs.createWriteStream(
  path.join(config.WEBPACK_CLIENT_ROOT, config.HTML_NAME)
)
index_writable.write(html)

// 热部署
app.use(
  devMiddleware(client_compiler, {
    noInfo: true,
    publicPath: '/',
  })
)
app.use(hotMiddleware(client_compiler))

// 静态资源服务器
app.use(require('koa-static')(config.WEBPACK_CLIENT_ROOT))

app.use(async (ctx, next) => {
  console.log(`请求网址：${ctx.request.url}`)

  ctx.response.type = 'html'
  ctx.response.body = fs.createReadStream(
    path.join(config.WEBPACK_CLIENT_ROOT, config.HTML_NAME)
  )
  await next()
})

// 监听端口
app.listen(config.PORT, () => {
  console.log(`正在监听端口：${config.PORT}`)
  opener(`http://127.0.0.1:${config.PORT}`)
})
