/**
 * tzw 2020年5月15日 16:44:02
 */

// 引入配置文件（系统基础配置）
const config = require('../config/app.config')

const path = require('path')
const webpack = require('webpack')
const webpack_server_config = require(`${config.CONFIG_ROOT}/webpack.config.js`)
const fs = require('fs')

const makeFile = async (url_path = '/') => {
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
  // 生成index文件
  return ssr_render(url_path)
}

webpack(webpack_server_config).run(async (err, stats) => {
  stats.stats.forEach(item => {
    if (item.compilation.errors && item.compilation.errors.length > 0) {
      console.log(`webpack报错`, item.compilation.errors)
    }
  })

  const html = await makeFile('/')

  // 在config.WEBPACK_CLIENT_ROOT里生成index.html
  if (!fs.existsSync(config.WEBPACK_CLIENT_ROOT)) {
    fs.mkdirSync(config.WEBPACK_CLIENT_ROOT)
  }
  const index_writable = fs.createWriteStream(
    path.join(config.WEBPACK_CLIENT_ROOT, config.HTML_NAME)
  )
  index_writable.once('close', function() {
    process.exit(0)
  })
  index_writable.write(html)
  index_writable.end()
})
