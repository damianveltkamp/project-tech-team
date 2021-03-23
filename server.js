import express from 'express';
import session from 'express-session';
import nunjucks from 'nunjucks';
import compression from 'compression';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectRedis from 'connect-redis';
import http from 'http';
import socketIO from 'socket.io';
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
const redisStore = connectRedis(session);
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
const server = http.createServer(app);
const io = new socketIO(server);

io.on('connection', (socket) => {
  console.log('User connected to server');

  socket.on('joinRoom', () => {
    console.log('socket wanting to join room');
    socket.join('kamer');
    console.log(io.sockets.adapter.rooms);
  });
});

mongoose.connect(dbUrl, {
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true,
});

const nunjucksEnv = nunjucks
  .configure(['source/views', ...defaultHelpers.getComponentPaths()], {
    autoescape: true,
    express: app,
  })
  .addGlobal('jsBundle', defaultHelpers.getJsBundleName())
  .addGlobal('cssBundle', defaultHelpers.getCssBundleName());

// TODO Favicon afvangen want word nu 2x heeeeeeye gelogt
app
  .use(compression())
  .use(express.static('static'))
  .use(express.json())
  .use(urlEncodedParser)
  .use(
    session({
      secret: process.env.SESSION_SECRET,
      name: process.env.SESSION_NAME,
      resave: false,
      saveUninitialized: true,
      store: new redisStore({ client: redisClient }),
    }),
  )
  .use((req, res, next) => {
    console.log('heeeeeeye');
    defaultHelpers.setCookieExpire(req);
    if (req.session.userID) {
      nunjucksEnv.addGlobal('loggedIn', req.session.userID);
      return next();
    }

    nunjucksEnv.addGlobal('loggedIn', false);
    return next();
  })
  .set('view engine', 'html')
  .set('io', io)
  .use('/', router);

server.listen(port);
