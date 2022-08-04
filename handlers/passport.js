const LocalStrategy = require('passport-local').Strategy;
const UserSchema = require('../models/UserSchema');
const bcryptjs= require('bcryptjs')



exports.initializingPassport = (passport)=>{
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
  },async (username,password,done)=>{
      try{
           const user = await UserSchema.findOne({email:username});

           if(!user) return done(null,false);

            // Load hash from your password DB.
            console.log(await bcryptjs.compare(password, user.password));

            if(! await bcryptjs.compare(password, user.password)) return done(null,false);

           return done(null, user);
      } catch (error) {
          return done(error, false);
      }        
  }
  ))


  passport.serializeUser((user, done) => {
      done(null, user.id);
  });

  passport.deserializeUser(async (id, done) =>{
      try{
          const user = await UserSchema.findById(id);

          done(null, user);
      }catch(error){
          done(error, false);
      }
  })
}

exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next()
  }
  res.status(401).redirect('/account/login')
};