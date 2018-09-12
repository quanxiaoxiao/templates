const Koa = require('koa');
const http = require('http');
const url = require('url');
const Router = require('koa-router');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');

const { api, middlewares = [] } = require('./api.js');
const apiParser = require('./apiParser');

const port = process.env.PORT || 3300;

const app = new Koa();
const router = new Router();

app.use(compress());
app.use(conditional());
app.use(etag());
app.use(cors());
app.use(logger());


middlewares.forEach((middleware) => {
  app.use(middleware);
});

app.use(router.routes()).use(router.allowedMethods());


const routeList = apiParser(api);

routeList
  .filter(item => item.handleType !== 'socket')
  .forEach(({ method, pathname, handle }) => {
    router[method.toLowerCase()](pathname, handle);
  });

const server = http.createServer(app.callback()).listen(port, () => {
  console.log(`server listen at port: ${port}`);
});

server.on('upgrade', (req, socket, head) => {
  const { pathname } = url.parse(req.url);
  const upgrade = routeList.find(item =>
    item.pathname === pathname &&
    item.method === 'GET' &&
    item.handleType === 'socket');
  if (upgrade) {
    console.log('socket connection:', socket.remoteAddress);
    upgrade.handle(req, socket, head);
  } else {
    console.log('socket destory:', socket.remoteAddress);
    socket.destroy();
  }
});

process.on('uncaughtException', (error) => {
  console.error(error);
  const killTimer = setTimeout(() => {
    process.exit(1);
  }, 3000);
  killTimer.unref();
});

