// 引入配置文件（系统基础配置）
const config = require('../config/app.config')
const webpack = require('webpack')
const path = require('path')
// 查看打包情况
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const ReactLoadablePlugin = require('@loadable/webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')

const getEntry = (target, is_dev, is_ssr) => {
  let entry = undefined

  if (target === 'web') {
    entry = {
      app: [path.join(config.CLIENT_ROOT, 'client_index.jsx')]
    }

    if (is_dev) {
      entry.app.push('webpack-hot-middleware/client?noInfo=true&reload=true')
    }
  } else {
    entry = {
      server: path.join(config.MIDDLEWARE_ROOT, 'AppSSR.js'),
      app: path.join(config.CLIENT_ROOT, 'client_index.jsx')
    }
  }

  return entry
}

const getOutput = (target, is_dev, is_ssr) => {
  let output = undefined
  if (target === 'web') {
    if (is_dev) {
      output = {
        path: config.WEBPACK_CLIENT_ROOT,
        pathinfo: true,
        filename: '[name].js',
        chunkFilename: 'chunk.[name].js',
        publicPath: '/'
      }
    } else {
      output = {
        path: config.WEBPACK_CLIENT_ROOT,
        filename: '[name].[chunkhash:8].js',
        chunkFilename: 'chunk.[name].[chunkhash:8].js',
        publicPath: '/'
      }
    }
  } else {
    output = {
      path: config.WEBPACK_SERVER_ROOT,
      filename: '[name].js',
      libraryExport: 'default',
      libraryTarget: 'commonjs2'
    }
  }

  return output
}

const getPlugins = (target, is_dev, is_ssr) => {
  const plugins = [
    // 懒加载
    new ReactLoadablePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        IS_DEV: is_dev,
        IS_SSR: is_ssr
      }
    }),
    // 打包样式文件
    new MiniCssExtractPlugin({
      filename: is_dev ? '[name].css' : '[name].[hash].css',
      chunkFilename: is_dev ? '[id].css' : '[id].[hash].css'
    }),
    // 打包时显示进度
    new webpack.ProgressPlugin(function(percentage, msg) {
      process.stdout.write(`${Math.floor(percentage * 100)}% ${msg}\r`)
    })
  ]

  if (is_dev) {
    // 打包情况
    plugins.push(new BundleAnalyzerPlugin())
    // 热更新
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  return plugins
}

const getModule = (target, is_dev, is_ssr) => ({
  rules: [
    {
      test: /\.(sa|sc)ss$/,
      use: [
        is_dev ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: is_dev
              ? '[path][name]__[local]--[hash:base64:5]'
              : '[hash:base64]'
          }
        },
        // 'postcss-loader',
        'sass-loader'
      ]
    },
    {
      test: /\.css$/,
      use: [is_dev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
    },
    {
      test: /(\.jsx|\.js)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader'
        }
      ]
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/images/',
            outputPath: 'images/',
            name: '[hash:8].[name].[ext]',
            limit: 8192
          }
        }
      ]
    }
  ]
})

const getOptimization = (target, is_dev, is_ssr) => {
  if (target === 'node') return {}
  let optimization = {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'all',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10
        }
      }
    }
  }

  // if (!is_dev) {
  //   optimization.splitChunks.maxSize = 2048000
  // }

  return optimization
}

const getConfig = (target, is_dev, is_ssr) => {
  const externals = []
  if (target === 'node') {
    externals.push(nodeExternals())
  }

  return {
    target,
    entry: getEntry(target, is_dev, is_ssr),
    output: getOutput(target, is_dev, is_ssr),
    mode: is_dev ? 'development' : 'production',
    module: getModule(target, is_dev, is_ssr),
    plugins: getPlugins(target, is_dev, is_ssr),
    externals,
    optimization: getOptimization(target, is_dev, is_ssr),
    resolve: {
      extensions: ['.js', '.jsx']
    }
  }
}

module.exports = [
  getConfig('node', config.DEBUG, config.SSR),
  getConfig('web', config.DEBUG, config.SSR)
]
