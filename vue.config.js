const path = require('path')
const url = 'http://localhost:9999'
const port = 8088
const resolve = dir => {
  return path.join(__dirname, dir)
}

const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'

module.exports = {
  publicPath: BASE_URL,
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: process.env.NODE_ENV !== 'production',
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  chainWebpack: config => {
    // key,value自行定义，比如.set('@@', resolve('src/components'))
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
  },
  // 配置转发代理
  devServer: {
    port: port,
    proxy: {
      '/code': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/code': '/code'
        }
      },
      '/auth': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/auth': '/auth'
        }
      },
      '/cms': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/cms': '/cms'
        }
      },
      '/task': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/task': '/task'
        }
      }
    }
  }
}
