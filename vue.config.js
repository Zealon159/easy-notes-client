const CompressionWebpackPlugin = require('compression-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const productionGzipExtensions = ['js', 'css'];

module.exports = {
  publicPath: '/',
  devServer: {
      port: 9000,
      proxy: {
          "/api": {
              //请求源地址
              target: 'http://localhost:8010',
              //是否跨域
              changeOrigin: true,  
              ws: true,
              pathRewrite: {
                  '^/api': ''
              }
          }
      }
  },
  configureWebpack : {
    plugins: [
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ],
    externals : {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      axios: 'axios',
      'antd': 'antd',
      'moment': 'moment',
      //'highlight.js': 'hljs',
      "mavon-editor": "MavonEditor"
    }
  },
  
}