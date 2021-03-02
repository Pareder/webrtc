const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function setupProxy(app) {
  app.use(createProxyMiddleware('/ws', {
    target: 'http://localhost:5000',
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
  }))
}
