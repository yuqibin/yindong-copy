/*
 * vue cli3.0 自定义配置（2.x迁移3.0写法变化）
 * @Author: mikey.yuqibin
 * @Date: 2019-08-12 15:47:54
 * @Last Modified by: mikey.yuqibin
 * @Last Modified time: 2020-08-12 17:48:49
 */

const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 上线二级域名
  publicPath: '/',
  // 生产环境是否生成 sourceMap 文件
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
  // webpack配置
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  // 配置webpack webpack-chain链式调用
  chainWebpack: config => {
    /* 添加分析工具*/
    if (process.env.NODE_ENV === 'production') {
      console.log('>>>>>>>', process.env.NODE_ENV)
      config.plugins.delete('prefetch')
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end();
      }
    }
    // config.plugins.delete('prefetch')
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