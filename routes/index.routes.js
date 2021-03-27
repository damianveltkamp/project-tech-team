import express from 'express';
import passport from 'passport';
import * as base from '@controllers/default.controller';
import * as account from '@controllers/account.controller';
import * as admin from '@controllers/admin.controller';
import { passportInit } from '@controllers/github.controller';
import { setCookie } from '@helpers/default.helpers';
import userController from '@controllers/database/users.controller';
import userSettings from '@controllers/database/users.settings.controller';

passportInit();

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.userID !== undefined) {
    return res.redirect('/overview');
  }

  return base.home(req, res);
});
router.get('/overview', (req, res) => {
  if (req.session.userID === undefined) {
    return res.redirect('/');
  }
  return base.overview(req, res);
});
router.post('/overview', base.overviewPost);
router.get('/matches-overview', base.matchesOverview);
router.post('/matches-overview', base.matchesOverviewPost);
router.get('/verify-account', account.verify);
router.get('/register', account.register);
router.post('/register', account.registerUser, (req, res) =>
  Object.keys(req.errors).length && req.errors.constructor === Object
    ? account.register(req, res)
    : res.redirect('/'),
);
router.get('/login', account.login);
router.post('/login', account.loginUser, async (req, res) => {
  if (Object.keys(req.errors).length && req.errors.constructor === Object) {
    return account.login(req, res);
  }

  const user = await userController.getUserByID(req.loggedInUser);

  return user.hasSetupAccount === false
    ? res.redirect('/onboarding')
    : res.redirect('/');
});
router.post('/logout', account.logout);
router.post('/resendVerificationEmail', account.resendVerificationEmail);
router.get('/onboarding', account.onboardingFlow);
router.post('/onboarding', account.postOnboardingFlow, (req, res) =>
  res.redirect('/'),
);
router.get('/user-settings', (req, res) => {
  if (req.session.userID !== undefined) {
    return account.userSettings(req, res);
  }

  return res.redirect('/');
});
router.post('/user-settings', account.updateUserSettings, account.userSettings);
router.get('/admin', async (req, res) => {
  if (req.session.userID !== undefined) {
    const user = await userController.getUserByID(req.session.userID);
    return user.role === 'admin'
      ? admin.dashboard(req, res)
      : res.redirect('/');
  }

  return res.redirect('/');
});
router.get('/auth/github', passport.authenticate('github'));
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.userID = req.user.id;
    req.session.githubUser = true;
    const userProfile = await userSettings.getUserProfile(req.session.userID);

    if (userProfile) {
      return res.redirect('/overview');
    }

    return res.redirect('/onboarding');
  },
);
router.get('*', base.notFound);

export default router;
