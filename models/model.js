const mongoose = require('mongoose')
const express = require('express')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        required: true,
        type: String
    },
    password:{ 
        required: true,
        type: String
    },
    notifications: Array,
    posts: Array,
    friends: Array,
    chats: Array,
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    }

})

const User = mongoose.model('chat-jam',UserSchema)

module.exports = User