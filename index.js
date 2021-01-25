const express = require('express')
const PORT = process.env.PORT || 5000
const app = express()
const mongodb = require('mongoose')
const ejs = require('ejs')
const path = require('path')
const privateRoutes = require('./routes/private-routes')
const publicRoutes = require('./routes/public-routes')
const passportSetup = require('./config/passport-setup.js')
const passport = require('passport')
const cookieSession = require('cookie-session')


mongodb.connect(process.env.MONGO_DB
,{ useUnifiedTopology: true, useNewUrlParser: true})

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/',publicRoutes)
app.use(express.static(path.resolve(__dirname,'./styles')))
app.use(express.static(path.resolve(__dirname,'./client/dist')))

app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [process.env.SECRET_KEY]
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api',privateRoutes)


app.listen(PORT,()=>console.log(`Running on port:${PORT}.`))
