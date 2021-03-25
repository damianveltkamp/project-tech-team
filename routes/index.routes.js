import express from 'express';
import * as base from '@controllers/default.controller';
import * as account from '@controllers/account.controller';
import * as admin from '@controllers/admin.controller';
import * as chat from '@controllers/chat.controller';
import { setCookie } from '@helpers/default.helpers';
import userController from '@controllers/database/users.controller';

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

  // Set user information in cookie
  setCookie(req);
  req.session.userID = req.loggedInUser;
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
router.post('/chat', chat.sendChatMessage);
router.get('*', base.notFound);

export default router;
