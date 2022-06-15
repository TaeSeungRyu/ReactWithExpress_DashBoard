const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
    app.use(
        createProxyMiddleware(
            ['/data'],
            {
                target: 'http://127.0.0.1:4885',
                changeOrigin: true
            }
        )
    )
}
