import express from 'express';
import session from 'express-session';
import nunjucks from 'nunjucks';
import compression from 'compression';
import cors from 'cors';
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
    console.log(`connected ${socket}`);
    socket.on('joinRoom', (roomID) => {
        console.log(roomID);
        socket.join(`custom:${roomID}`);
    });

    socket.on('message', ({ message, roomID }) => {
        socket.broadcast.to(`custom:${roomID}`).emit('send-message', message);
    });

    socket.on('disconnect', () => {
        socket.removeAllListeners();
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
    .use(cors())
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
        defaultHelpers.setCookieExpire(req);
        if (req.session.userID) {
            nunjucksEnv.addGlobal('userID', req.session.userID);
            nunjucksEnv.addGlobal('role', req.session.role);
            return next();
        }

        nunjucksEnv.addGlobal('userID', false);
        return next();
    })
    .set('view engine', 'html')
    .set('io', io)
    .use('/', router);

server.listen(port);