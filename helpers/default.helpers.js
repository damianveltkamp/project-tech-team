import fs from 'fs';
import dotenv from 'dotenv';
import redis from 'redis';
import RateLimiter from 'limiter';
import * as account from '@controllers/account.controller';

dotenv.config();

const limiter = new RateLimiter.RateLimiter(20, 20000);
const registerLimiter = new RateLimiter.RateLimiter(2, 20000);

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

export const rateLimit = (req, res, next) => {
  limiter.removeTokens(1, () => {
    if (limiter.tokensThisInterval >= limiter.tokenBucket.bucketSize) {
      req.errors = {};
      req.errors.limit =
        'You have made too many requests, which is why we no longer make it possible for you to send the form';

      return account.login(req, res);
    }
    return next();
  });
};

export const registerRateLimit = (req, res, next) => {
  registerLimiter.removeTokens(1, () => {
    if (
      registerLimiter.tokensThisInterval >=
      registerLimiter.tokenBucket.bucketSize
    ) {
      req.errors = {};
      req.errors.registerLimit =
        'You have made too many requests, which is why we no longer make it possible for you to send the form';

      return account.register(req, res);
    }
    return next();
  });
};
