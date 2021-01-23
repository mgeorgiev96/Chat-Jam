const express = require('express')
const passport = require('passport')
const { authenticate } = require('passport')
const router = express.Router()
const path = require('path')
const User = require('../models/model.js')
const bcrypt = require('bcrypt')
const uniqid = require('uniqid')
const { response } = require('express')


//User Authentication
const userAuthentication = (req,res,next)=>{
    if(!req.user && !req.session.user){
        res.redirect('/')
    }else{
        next()
    }
}

//Logout Page url
router.get('/logout',(req,res)=>{
    if(req.user){
        req.logout()
    }else{
        req.session.user = null
    }
    res.end()
})

//Login Page url
router.post('/login',(req,res)=>{
    User.findOne({username:req.body.username}).then(user=>{
        if(user){
            bcrypt.compare(req.body.password,user.password,(err,result)=>{
                if(result){
                    req.logout()
                    req.session.user = {
                        username: user.username,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        posts: user.posts,
                        friends: user.friends,
                        notifications: user.notifications,
                        chats: user.chats
                    }
                    res.redirect('/api/profile')
                }else{
                    res.redirect('/wrong-password')
                }
            })
        }else{
            res.redirect('/wrong-username')
        }
    })
})

//Signup Page url
router.post('/signup',(req,res)=>{
    User.findOne({username:req.body.username}).then(user=>{
        if(user){
            res.redirect('/email-used')
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                new User({
                    username: req.body.username,
                    password: hash,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    friends: [],
                    posts: [],
                    notifications: [],
                    chats: []
                }).save().then(()=>res.redirect('/')).catch(err=>console.log(err))
            })
        }
    })
})






//App routes
router.get('/home',userAuthentication,(req,res)=>{
    res.sendFile(path.resolve(__dirname,'../client/dist/index.html'))
})
router.get('/chats',userAuthentication,(req,res)=>{
    res.sendFile(path.resolve(__dirname,'../client/dist/index.html'))
})
router.get('/profile',userAuthentication,(req,res)=>{
    res.sendFile(path.resolve(__dirname,'../client/dist/index.html'))
})
router.get("/userprofile",userAuthentication,(req,res)=>{
    res.sendFile(path.resolve(__dirname,'../client/dist/index.html'))
})


//Google Authentication
router.get('/google',passport.authenticate('google',{
    scope: ['https://www.googleapis.com/auth/plus.login','email'],
    prompt: ['select_account']
}))

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    res.redirect('/api/profile')
})

//User Info url
router.get('/info',(req,res)=>{
    if(req.user){
        res.json({
            username: req.user.username,
            notifications: req.user.notifications,
            posts: req.user.posts,
            friends: req.user.friends,
            chats: req.user.chats,
            first_name: req.user.first_name,
            last_name: req.user.last_name
        })
    }else{
        res.json({
            username: req.session.user.username,
            notifications: req.session.user.notifications,
            posts: req.session.user.posts,
            friends: req.session.user.friends,
            chats: req.session.user.chats,
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name
        })
    }
})


//Database actions

router.post('/friend-search',(req,res)=>{
    User.findOne({username:req.body.username}).then(user=>{
        if(user){
            res.json({username:user.username})
        }else{
            res.json({username:''})
        }
    })
})
router.post('/send-request',(req,res)=>{
    User.findOne({username:req.body.user}).then(user=>{
        User.update({username:req.body.username},{
            $pull: {notifications:{username:user.username}}
        }).then(()=>{
            User.findOne({username:req.body.user}).then(user=>{
                User.update({username:req.body.username},{
                    $push: {notifications:{
                        username: user.username,
                        notification: `${user.username} wants to be friends with you.`,
                        id: uniqid()
                    }}
                }).catch(err=>console.log(err))
            })
        }).catch(err=>console.log(err))
    }).then(()=>res.json('complete')).catch(err=>console.log(err))
})
router.post('/request-response',(req,res)=>{
    if(response){
        User.findOne({username:req.body.username}).then(userA=>{
            User.update({username:req.body.user},{
                $push: {friends:{
                    id: userA.username,
                    first_name: userA.first_name,
                    last_name: userA.last_name
                }}
            }).then(()=>{
                User.findOne({username:req.body.user}).then(userB=>{
                    User.update({username:req.body.username},{
                        $push: {friends:{
                            id: userB.username,
                            first_name: userB.first_name,
                            last_name: userB.last_name
                        }}
                    }).then(()=>{
                        User.update({username: req.body.username},{
                            $pull: {notifications:{id:req.body.notificationID}}
                        }).then(()=>{
                            User.findOne({username:req.body.username}).then(user=>{
                                if(req.user){
                                    req.user= {
                                        username: user.username,
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                        friends: user.friends,
                                        posts: user.posts,
                                        notifications: user.notifications,
                                        chats: user.chats
                                    }
                                    res.json(req.user)
                                }else{
                                    req.session.user = {
                                        username: user.username,
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                        friends: user.friends,
                                        posts: user.posts,
                                        notifications: user.notifications,
                                        chats: user.chats
                                    }
                                    res.json(req.session.user)
                                }
                            }).catch(err=>console.log(err))
                        }).catch(err=>console.log(err))
                    }).catch(err=>console.log(err))
                }).catch(err=>console.log(err))
            })
        })
    }else{

    }
})
router.post('/save-chat',(req,res)=>{
    User.update({username:req.body.user},{
        $pull: {chats:{id:req.body.username}}
    }).then(()=>{
        User.update({username:req.body.user},{
            $push: {chats:{
                id: req.body.username,
                chat: req.body.chat
            }}
        }).then(()=>{
            User.update({username:req.body.username},{
                $pull: {chats:{id:req.body.user}}
            }).then(()=>{
                User.update({username:req.body.username},{
                    $push: {chats:{
                        id:req.body.user,
                        chat: req.body.chat
                    }}
                }).then(()=>{
                    User.findOne({username:req.body.username}).then(user=>{
                        if(req.user){
                            req.user= {
                                username: user.username,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                friends: user.friends,
                                posts: user.posts,
                                notifications: user.notifications,
                                chats: user.chats
                            }
                            res.json(req.user)
                        }else{
                            req.session.user = {
                                username: user.username,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                friends: user.friends,
                                posts: user.posts,
                                notifications: user.notifications,
                                chats: user.chats
                            }
                            res.json(req.session.user)
                        }
                    }).catch(err=>console.log(err))
                }).catch(err=>console.log(err))
            })
        })
    })
})

router.post('/save-post',(req,res)=>{
    User.update({username:req.body.username},{
        $push: {posts:req.body}
    }).then(()=>{
        User.findOne({username:req.body.username}).then(user=>{
            if(req.user){
                req.user= {
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    friends: user.friends,
                    posts: user.posts,
                    notifications: user.notifications,
                    chats: user.chats
                }
                res.json(req.user)
            }else{
                req.session.user = {
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    friends: user.friends,
                    posts: user.posts,
                    notifications: user.notifications,
                    chats: user.chats
                }
                res.json(req.session.user)
            }
        }).catch(err=>console.log(err))
    })
})

router.post('/leave-comment',(req,res)=>{
    let postSelected = ''
    User.findOne({username:req.body.username}).then(user=>{
        user.posts.map(post=>post.id===req.body.postID ? postSelected = post : '')
        postSelected.comments.push({
            id: req.body.commentID,
            user: req.body.user,
            name: req.body.name,
            description: req.body.description
        })
    }).then(()=>{
        User.update({username:req.body.username},{
            $pull: {posts:{id:req.body.postID}}
        }).then(()=>{
            User.update({username:req.body.username},{
                $push: {posts:{
                    username: postSelected.username,
                    image: postSelected.image,
                    title: postSelected.title,
                    description: postSelected.description,
                    id:postSelected.id,
                    comments: postSelected.comments,
                    name:postSelected.name
                }}
            }).then(()=>{
                if(req.body.loggedUser){
                    User.findOne({username:req.body.username}).then(user=>{
                        res.json({                            
                            username: user.username,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            friends: user.friends,
                            posts: user.posts,
                            notifications: user.notifications,
                            chats: user.chats
                        })
                    }).catch(err=>console.log(err))
                }else{
                    User.findOne({username:req.body.username}).then(user=>{
                        if(req.user){
                            req.user= {
                                username: user.username,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                friends: user.friends,
                                posts: user.posts,
                                notifications: user.notifications,
                                chats: user.chats
                            }
                            res.json(req.user)
                        }else{
                            req.session.user = {
                                username: user.username,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                friends: user.friends,
                                posts: user.posts,
                                notifications: user.notifications,
                                chats: user.chats
                            }
                            res.json(req.session.user)
                        }
                    }).catch(err=>console.log(err))
                }
            }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
})

router.post("/get-user-profile",(req,res)=>{
    User.findOne({username:req.body.username}).then(user=>{
        res.json({
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            friends: user.friends,
            posts: user.posts,
            notifications: user.notifications,
            chats: user.chats
        })
    }).catch(err=>console.log(err))
})
module.exports = router