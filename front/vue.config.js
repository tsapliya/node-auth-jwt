const webpack = require('webpack')


/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  devServer: {
   // host: `localhost`,
    port: 1117,
    https: true,
    proxy: {
      '^/api': {
        target: 'http://localhost:4444/api',
        pathRewrite: { '^/api': '' },
      }
    }
  },

  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({ adapter: ['webrtc-adapter', 'default'] })
    ]
  }
}
