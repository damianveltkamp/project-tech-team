import passport from 'passport';
import GitHubStrategy from 'passport-github2';

export function passportInit() {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `http://localhost:3000/auth/github/callback`,
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
