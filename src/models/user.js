const mongoose=require('mongoose')

const bcrypt=require('bcryptjs')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    }
})



userSchema.pre("save",async function(next){
    console.log("hash the password")
    this.password=await bcrypt.hash(this.password,10)
    next();
})







// Create a new Collection
const Register=new mongoose.model('Register',userSchema)
module.exports=Register;