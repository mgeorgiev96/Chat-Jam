const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/model.js')

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then(user=>{
        done(null,user)
    })
})

passport.use(new GoogleStrategy({
    clientSecret: 'gbAfRDQVH7dx-xbOy8rJ3Vvp',
    clientID: '984651524053-5f3q4tlbgpm686n44c91el4uvn5pbmrk.apps.googleusercontent.com',
    callbackURL: '/api/google/redirect'
},(accessToken,refreshToken,profile,done)=>{
    User.findOne({username:profile._json.email}).then(user=>{
        if(user){
            done(null,user)
        }else{
            new User({
                username: profile._json.email,
                password: profile.id,
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                posts: [],
                friends: []
            }).save().then(()=>done(null,user)).catch(err=>console.log(err))
        }
    }).catch(err=>console.log(err))
}))