import express from 'express';
import session from 'express-session';
import nunjucks from 'nunjucks';
import compression from 'compression';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectRedis from 'connect-redis';
import router from './routes/index.routes';
import * as defaultHelpers from './helpers/default.helpers';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const urlEncodedParser = express.urlencoded({ extended: true });
const environment = process.env.ENVIRONMENT || 'development';
const redisPort = process.env.REDIS_PORT || 6379;
const redisString = defaultHelpers.setRedisString(environment, redisPort);
const redisClient = defaultHelpers.setupRedisClient(environment, redisString);
// This is not written in cammelcase because this is a constructor
const RedisStore = connectRedis(session);
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

mongoose.connect(dbUrl, {
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true,
});

nunjucks
  .configure(['source/views', ...defaultHelpers.getComponentPaths()], {
    autoescape: true,
    express: app,
  })
  .addGlobal('jsBundle', defaultHelpers.getJsBundleName())
  .addGlobal('cssBundle', defaultHelpers.getCssBundleName());

app
  .use(compression())
  .use(express.json())
  .use(urlEncodedParser)
  .use(
    session({
      secret: process.env.SESSION_SECRET,
      name: process.env.SESSION_NAME,
      resave: false,
      saveUninitialized: true,
      store: new RedisStore({ client: redisClient }),
    }),
  )
  .use(express.static('static'))
  .set('view engine', 'html')
  .use('/', router)
  .listen(port);
