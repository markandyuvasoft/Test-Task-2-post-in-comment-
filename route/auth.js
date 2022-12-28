import express from 'express'
import User from '../models/authM.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const authRouter= express.Router()


//BCRYPT PASSWORD USE THIS METHOD START
const secure = async (password) => {
      const passwordhash = await bcrypt.hash(password, 10)
      return passwordhash
  }
//BCRYPT PASSWORD USE THIS METHOD END
const createtoken = async (id, res) => {

    try {
  
      // const tokn = await Jwt.sign({ _id: id }, config.secret)
  
      const tokn = await jwt.sign({ _id: id }, "privatekey", {
  
        expiresIn: "24h"
      })
  
      return tokn
  
    } catch (error) {
  
      res.send("error")
    }
  }


authRouter.post("/signup",async(req,res)=>{

    const { name, email, password, phone } = req.body
  
    if (!name || !email || !password ||  !phone ) {
  
      return res.status(422).send({ error: "please add all the fields" })
    }
    else {

        const spassword = await secure(req.body.password)
    
        const user = new User({
          name, email, phone,
          password: spassword
            })
    
        const userdata = await User.findOne({ email: req.body.email })
    
        if (userdata) {
    
          res.status(400).send({ error: "user already exist" })
    
        }
        else {
          const userdata1 = await user.save()
          res.status(200).send({ message: "User Register successfully" })
            }
      }
})


authRouter.post("/signin",async(req,res)=>{

    const { email, password } = req.body;

    if (!email || !password) {
  
      res.status(400).send({ error: "please add email or password" })
    }
    else {

        let user = await User.findOne({ email: req.body.email })
    
        if (!user) {
    
          return res.status(404).send({ error: "Invalid Email Please Try Again" })
    
        } 
         else {
          const checkpassword = await bcrypt.compare(req.body.password, user.password);
    
          if (!checkpassword) {
    
            return res.status(404).send({ error: "Invalid Password Please Try Again" })
          }
          const token = await createtoken(user._id)

          let Id = user._id
          res.status(200).send({ success: "😉welcome user..!!", token, Id })
    
        }
      }
})



export default authRouter