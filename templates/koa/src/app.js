const Koa = require('koa');
const logger = require('koa-logger');
const router = require('./routers');

const port = 3000;

const app = new Koa();
app.use(logger());

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`listen at port: ${port}`);
});
