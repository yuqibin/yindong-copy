/*
 * vue cli3.0 自定义配置（2.x迁移3.0写法变化）
 * @Author: mikey.yuqibin
 * @Date: 2019-08-12 15:47:54
 * @Last Modified by: mikey.yuqibin
 * @Last Modified time: 2020-08-07 09:47:26
 */

const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 上线二级域名
  publicPath: '/',
  // 打包不生成map文件
  productionSourceMap: false,
  devServer: {
    proxy: {
      // 配置跨域
      '/apic': {
        target: 'http://localhost:8008',
        changeOrigin: true,
        autoRewrite: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          '^/apic': '/'
        }
      }
    }
  },
  pwa: {
    iconPaths: {
      favicon192: 'favicon.ico',
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  // 配置webpack webpack-chain链式调用
  chainWebpack: config => {
    // config.entry.app = ['babel-polyfill', './src/main.js']
    config
      .resolve.alias
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
      .set('api', resolve('src/api'))
      .set('assets', resolve('src/assets'))
      .set('views', resolve('src/views'))
  },
  // 可以断点调试（不加则看不到代码）
  configureWebpack: {
    devtool: 'source-map'
  }
}