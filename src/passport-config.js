const { Strategy: LocalStrategy } = require('passport-local');
const { UserRegisterModel, AdminRegisterModel } = require("./models/authModel");
const bcrypt = require('bcryptjs');

function passportConfig(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = email.endsWith('@admin.com')
        ? await AdminRegisterModel.findOne({ email })
        : await UserRegisterModel.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      return isPasswordValid
        ? done(null, user)
        : done(null, false, { message: 'Password incorrect' });
    } catch (error) {
      return done(error);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserRegisterModel.findById(id);
      return user ? done(null, user) : done(null, await AdminRegisterModel.findById(id));
    } catch (error) {
      return done(error);
    }
  });
}

module.exports = passportConfig;
