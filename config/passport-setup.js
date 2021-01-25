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
    clientSecret: process.env.CLIENT_SECRET,
    clientID: process.env.CLIENT_ID,
    callbackURL: process.env.CALLBACK_URL
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
                friends: [{
                    id: 'test@abv.bg',
                    first_name: 'Test',
                    last_name: 'Test1'
                }],
                notifications: [],
                chats: []
            }).save().then(()=>{
                User.update({username:'test@abv.bg'},{
                    $pull: {friends:{id: profile._json.email}}
                }).then(()=>{
                    User.update({username:'test@abv.bg'},{
                        $push: {friends:{
                            id: profile._json.email,
                            first_name: profile.name.givenName,
                            last_name: profile.name.familyName,
                        }}
                    }).then(()=>done(null,user)).catch(err=>console.log(err))
                }).catch(err=>console.log(err))
            }).catch(err=>console.log(err))
        }
    }).catch(err=>console.log(err))
}))