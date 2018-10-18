const mongoose = require('mongoose')
const Schema = mongoose.Schema

// User Schema
const UserSchema = new Schema({
    googleID: {
        type:String,
        required:true // if there are other Strategy, set this to false
    },
    email:{
        type:String,
        required:true 
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    img:{
        type:String
    }
})

mongoose.model('users', UserSchema)