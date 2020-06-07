/**
 * 配置文件（非常重要，很多地方会引用当前文件）
 * tzw 2017年5月22日13:57:44
 */
/*global module require */
const path = require('path')

module.exports = {
  APP_ROOT: path.resolve('./'), // 项目根目录
  HTML_NAME: 'mky_index.html', // 为React App生成的html名称 直接访问该文件时 SSR失效
  CONFIG_ROOT: path.resolve('./config'), // 项目配置文件夹
  CLIENT_ROOT: path.resolve('./client'), // 前端入口文件
  TMP_ROOT: path.resolve('./server/tmp'), // 模板文件夹
  MIDDLEWARE_ROOT: path.resolve('./server/middleware'), // 打包前端代码（前端使用）
  WEBPACK_CLIENT_ROOT: path.resolve('./webpack_client'), // 打包前端代码（前端使用）
  WEBPACK_SERVER_ROOT: path.resolve('./webpack_server'), // 打包前端代码（后端使用）
  WEBPACK_SERVER_OUTPUT: 'app.js', // 后端输出文件（主包）
  // 端口
  PORT: 3005,
  // 是否是调试模式
  DEBUG: process.env.IS_DEV === 'true',
  // 是否开启服务器端渲染
  SSR: process.env.IS_SSR === 'true',
}
