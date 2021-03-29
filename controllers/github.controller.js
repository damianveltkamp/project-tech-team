import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();

export function passportInit() {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        // TODO verander deze sting
        callbackURL: `${process.env.APP_URL}/auth/github/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, profile);
      },
    ),
  );

  passport.serializeUser((user, callback) => {
    callback(null, user.id);
  });

  passport.deserializeUser((id, callback) => {
    callback(null, id);
  });
}
