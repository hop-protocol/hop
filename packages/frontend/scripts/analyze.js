process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpackConfigProd = require('react-scripts/config/webpack.config')('production')

webpackConfigProd.plugins.push(new BundleAnalyzerPlugin())

webpack(webpackConfigProd, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err)
  }
})
