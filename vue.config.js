module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        querystring: 'querystring-browser'
      }
    }
  }
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Timer/dist'
    : '/'
}