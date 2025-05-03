const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Ensure the path is correct

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      console.log("Passport strategy received username:", username);
      try {
        // Use a regular expression for case-insensitive search
        const user = await User.findOne({ 
          username: { $regex: new RegExp('^' + username + '$', 'i') } 
        });
        if (!user) {
          console.error("User not found for username:", username);
          return done(null, false, { message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (error) {
        console.error("Error in Passport Strategy:", error);
        return done(error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
