const Koa = require('koa');
const path = require('path');
const logger = require('koa-logger');
const views = require('koa-views');
const session = require('koa-session2');
const Store = require('./untils/store');
const router = require('./routes');
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');

const app = new Koa();
app.use(koaBody({ multipart: true }));
app.use(session({
  store: new Store(),
  key: 'SESSIONID', // default "koa:sess"
  maxAge: 1000 * 60 * 60 * 24,
  overwrite: true,
}));

app.use(logger());
app.use(bodyParser());
app.use(views(path.resolve(__dirname, '../'), { extension: 'html' }));
app.use(router.routes());

app.listen(3000);
