const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/api/', {
    changeOrigin: true,
    secure: false,
    pathRewrite: {'^/api': ''}, // remove leading /api to match real API urls
    target: (process.env.REACT_APP_BACKEND || 'http://localhost:8080'),
  }));
};