import  express  from "express";
import checkauth from "../middleware/authT.js";
import User from "../models/authM.js";
import Post from "../models/postM.js";


const router=express.Router()

// post the details.......
router.post("/api/post",checkauth ,async (req, res) => {

    const {title,body} = req.body 

    if(!title || !body ){

      return  res.status(422).json({error:"Plase add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.status(200).send({post:result})
    })
    .catch(err=>{
        res.status(400).send("error")
    })

})

// comment to post............
router.post('/api/comment',checkauth,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).send({error:err})
        }else{
            res.status(200).send(result)
        }
    })
})

// get all details.........
router.get('/api/getAll',checkauth,async(req,res)=>{

  try {
    const user = await User.find({ _id: req.user._id })

      const get = await Post.find().populate("postedBy", "_id name")

      res.status(200).send(get)
  
}
  catch (err) {
      res.status(400).send({message:"user not found"})
  }
})

// delete the details............
router.delete("/api/delete/:id",checkauth,async(req,res)=>{

    try{
        const _id= req.params.id

        const del= await Post.findByIdAndDelete(_id)

        res.status(200).send({success: "deleted user data"})
    }
    catch(err)
    {
        res.status(500).send(err)
    }
})

// update the details...............
router.put("/api/update/:id", checkauth, async(req,res)=>{
    try {
        const {  title, body } = req.body;

        const _id= req.params.id

        var user = await Post.findByIdAndUpdate(_id,{

          title:req.body.title,
         body:req.body.body,
          new:true
        })
        // console.log(user);
        user.save()
        .then(()=>res.json({
          success: 1,
          user
        }))
        
      } catch (error) {
        res.status(400).send({error:"token is invalid user not found"})
      }
})


// get post by id...................
router.get("/api/get/:id",checkauth,async(req,res)=>{

    try{

    const _id= req.params.id

    const getid= await Post.findById(_id)

    res.status(200).send(getid)
    
  }
    catch(err)
    {
        res.status(400).send(err)
    }
})

// get my post......................
router.get("/api/myPost",checkauth,async(req,res)=>{

    try{

        const get= await  Post.find({postedBy:req.user._id}) .populate("postedBy", "_id name")
    
        res.status(200).send(get)
        
      }
        catch(err)
        {
        res.status(400).send(err)
        }
})
export default router