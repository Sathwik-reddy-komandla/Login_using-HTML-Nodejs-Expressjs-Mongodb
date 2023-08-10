const jwt=require('jsonwebtoken')

const Register=require('../models/user')

const auth=async (req,res,next)=>{
    try{

        console.log(`"""""""""""""""""""""Verifying User TOken"""""""""`)
        const token=req.cookies.jwt
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY)
        const user=await Register.findOne({_id:verifyUser._id})
        req.token=token;
        req.user=user
        next()
    }catch(e){
        console.log(e)
        res.status(401).send(e)
    }
}


module.exports=auth;