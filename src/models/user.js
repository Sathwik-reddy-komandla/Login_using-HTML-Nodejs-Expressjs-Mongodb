const mongoose=require('mongoose')

const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

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
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.methods.generateAuthToken= async function(){
    try{
        const gentoken = await  jwt.sign({_id:this._id},process.env.SECRET_KEY)
        console.log(gentoken)
        this.tokens=this.tokens.concat({token:gentoken})
        await this.save()
        return gentoken
    }catch(e){
        console.log(e)
    }
}

userSchema.pre("save",async function(next){
        if(this.isModified('password')){

        const salt=await bcrypt.genSalt(10)
        const hashedPasword=await bcrypt.hash(this.password,salt)
        this.password=hashedPasword
        console.log(hashedPasword)
        next()
        }
})

// userSchema.methods.comparePassword= async  function (password){
//     if(!password) throw new Error('Password is missing');
//     try{
//         const result=await bcrypt.compare(password,this.password)
//         console.log(result)
//         return result
//     }catch(error){
//         console.log(error)
//     }
//  }

// Create a new Collection
const Register=new mongoose.model('Register',userSchema)
module.exports=Register;