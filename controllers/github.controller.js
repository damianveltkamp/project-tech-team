export function gitLogin(){
    // const passport = require('passport')
    const GitHubStrategy = require('passport-github2').Strategy;

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
        function(profile, done) {
            User.findOrCreate({ githubId: profile.id }, function (err, user) {
                return done(err, user);
            });
        }
    ));
}