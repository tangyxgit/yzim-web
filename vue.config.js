const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  assetsDir: './',
  devServer: {
    proxy: {
      '/api': {
        // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
        target: 'http://118.31.108.13:8099',
        // 允许跨域
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('tim', resolve('src/tim.js'))
  },
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        // 自定义主题场景
        import: [path.resolve(__dirname, './src/assets/css/base.styl')]
      }
    }
  }
}
