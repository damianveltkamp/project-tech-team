import fs from 'fs';
import dotenv from 'dotenv';
import redis from 'redis';
import moment from 'moment';

dotenv.config();

export function getComponentPaths() {
  const componentsPath = 'source/components';
  const components = fs.readdirSync(componentsPath);

  const templatePaths = components.map(
    (component) => `${componentsPath}/${component}/template/`,
  );

  return templatePaths;
}

export function getCssBundleName() {
  const cssBundle = fs.readdirSync('static/build/css/');
  return cssBundle[0];
}

export function getJsBundleName() {
  const jsBundle = fs.readdirSync('static/build/js/');
  return jsBundle[0];
}

export function setRedisString(environment, redisPort) {
  return environment === 'development'
    ? `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${redisPort}`
    : `rediss://${process.env.REDIS_USER}:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${redisPort}`;
}

export function setupRedisClient(environment, redisString) {
  return environment === 'development'
    ? redis.createClient(redisString)
    : redis.createClient(redisString, { tls: {} });
}

export function setCookie({ session, loggedInUser }) {
  session.userID = loggedInUser;
  return session;
}

export function setCookieExpire({ session }) {
  // session.cookie.expires = new Date(Date.now() + 3600000 / 4);
  session.cookie.expires = new Date(Date.now() + 5000);
}

export function cookieExpireHandler({ session }, res) {
  setInterval(() => {
    const expired = moment().isAfter(session.cookie._expires);
    if (expired === true) {
      return res.redirect('/');
    }
  }, 1000);
}
