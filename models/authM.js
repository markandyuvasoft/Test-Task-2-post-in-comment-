import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

var Schema= mongoose.Schema


const userSchema=new mongoose.Schema({

    name:{
        type:String,
        },

    email:{
        type:String,
        },
    
    password:{
        type:String
    },

    phone:{
        type:Number,
    },

},{versionKey: false})    


const User=mongoose.model('User',userSchema)

export default User