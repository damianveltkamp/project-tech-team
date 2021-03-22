# node-boilerplate

Boilerplate for node projects using:

- Webpack
- Nodemon
- Browsersync
- Module aliases

## Table of contents

- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Usage](#usage)

---

## Prerequisites

- [NodeJS](https://nodejs.org/en/)

---

## Installing

Important to execute these top to bottom!

### Clone this repository into your local project folder

```
git clone https://github.com/damianveltkamp/project-tech-team.git
```

### Install packages

```
npm install
```

### Setup environment variables

#### DB_USER

Username that you use for your mongodb

#### DB_PASS

Password that you use for your mongobg

#### DB_HOST

Host string that you use for your mongodb

#### EMAIL

Email address from which emails will be send with nodemailer (example use, verification email on register)

#### EMAIL_PASS

Password of the email that you want to use to send emails from with nodemailer

#### CAPTCHA_SITE_KEY

Google recaptcha site key for version 2

[Information on how to setup google recaptcha can be found here](https://www.google.com/recaptcha/about/)

#### CAPTCHA_SECRET

Google recaptcha secret key

[Information on how to setup google recaptcha can be found here](https://www.google.com/recaptcha/about/)

#### SESSION_SECRET

Generated string to set to the session, this string can be anything but highly recommended to generate a random string with [node crypto](https://nodejs.org/api/crypto.html)

#### SESSION_NAME

The name of the session cookie

#### REDIS_USER

The username that will be used for the redis server, this can be anything and this has no setup required.

#### REDIS_PASS

The password that will be asked for when connecting to the redis-cli

#### REDIS_HOST

The host address where you host the redis server, for local development this is localhost

### Spin up a redis caching server

```
redis-server redis.conf
```

### To run a dev server type this into your terminal when you are inside your project folder

```
npm run dev
```

---

## Usage

Run local development server with webpack, nodemon and browsersync

```
npm run dev
```

Build with webpack development config

```
npm run build:dev
```

Build with webpack production config

```
npm run build:prod
```

Run command for running server on production

```
npm run deploy:prod
```

---

## License

Find the license for the repository here
[License](https://github.com/damianveltkamp/project-tech-team/blob/develop/LICENSE)
