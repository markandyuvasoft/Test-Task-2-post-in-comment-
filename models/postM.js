import mongoose from "mongoose";
const {ObjectId}= mongoose.Schema.Types


const postSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
    postedBy:{
        type:ObjectId,
        ref:"User"
     },

},{versionKey: false})


const Post= mongoose.model('Post',postSchema)

export default Post