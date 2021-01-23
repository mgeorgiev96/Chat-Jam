const { Router } = require('express')
const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('login')
})

router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.get('/wrong-username',(req,res)=>{
    res.render('wrong-username')
})
router.get('/wrong-password',(req,res)=>{
    res.render('wrong-password')
})
router.get('/email-used',(req,res)=>{
    res.render('email-used')
})

module.exports = router