/**
 * tzw 2017年8月29日14:32:23
 */
// 严格模式
'use strict'

// 引入配置文件（系统基础配置）
const config = require('../config/app.config')

const fs = require('fs')
const path = require('path')

// 模板引擎
const Env = require('./middleware/nunjucksEnv')

// Koa框架
const Koa = require('koa')

// Koa实例化出来一个application
const app = new Koa()
const compress = require('koa-compress')

// 服务器端渲染
const ssr_render = require(path.join(config.WEBPACK_SERVER_ROOT, 'server.js'))

// 加载scss文件的钩子
require('css-modules-require-hook')({
  extensions: ['.scss'],
  preprocessCss: (data, filename) =>
    require('node-sass').renderSync({
      data,
      file: filename
    }).css,
  camelCase: true,
  generateScopedName: config.DEBUG
    ? '[path][name]__[local]--[hash:base64:5]'
    : '[hash:base64]'
})

// 加载css文件的钩子
require('css-modules-require-hook')({
  extensions: ['.css'],
  camelCase: true,
  generateScopedName: config.DEBUG
    ? '[path][name]__[local]--[hash:base64:5]'
    : '[hash:base64]'
})

// 加载图片的钩子
require('asset-require-hook')({
  extensions: ['jpg', 'png', 'gif', 'webp'],
  limit: 8192,
  generateScopedName: 'images/[hash:8].[name].[ext]'
})

app.use(compress({ threshold: 2048 }))

// 静态资源服务器
app.use(
  require('koa-static')(config.WEBPACK_CLIENT_ROOT, {
    maxage: 31536000000
  })
)
app.use(async (ctx, next) => {
  config.DEBUG && console.log(`请求网址：${ctx.request.url}`)

  ctx.response.type = 'html'
  // 返回页面 服务器端渲染就实时计算页面 否则就默认返回一个主页
  if (config.SSR) {
    ctx.response.body = ssr_render(ctx.request.url)
  } else {
    ctx.response.body = fs.createReadStream(
      path.join(config.WEBPACK_CLIENT_ROOT, config.HTML_NAME)
    )
  }
})

// 监听端口
app.listen(config.PORT, () => {
  console.log(`正在监听端口：${config.PORT}`)
})
