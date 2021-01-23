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
const socket = require('socket.io')


mongodb.connect('mongodb://mgeorgiev9611:martin12345@testcluster1-shard-00-00.u94v9.mongodb.net:27017,testcluster1-shard-00-01.u94v9.mongodb.net:27017,testcluster1-shard-00-02.u94v9.mongodb.net:27017/<dbname>?ssl=true&replicaSet=TestCluster1-shard-0&authSource=admin&retryWrites=true&w=majority'
,{ useUnifiedTopology: true, useNewUrlParser: true})

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/',publicRoutes)
app.use(express.static(path.resolve(__dirname,'./styles')))
app.use(express.static(path.resolve(__dirname,'./client/dist')))

app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: ['secretkey']
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api',privateRoutes)


const server = app.listen(PORT,()=>console.log(`Running on port:${PORT}.`))
let io = socket(server)

io.on('connection',(socket)=>{
    socket.on('chat',(data)=>{
        io.sockets.emit('chat',data)
    })
})