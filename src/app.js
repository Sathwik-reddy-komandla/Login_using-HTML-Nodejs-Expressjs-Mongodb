const express=require('express');
require('./db/conn')
const path=require('path')
const hbs=require('hbs')
const Register=require('./models/user')
const bcrypt=require('bcryptjs');


const static_path=path.join(__dirname,'../public')
const template_path=path.join(__dirname,'../templates/views')
const partials_path=path.join(__dirname,'../templates/partials')

const app=express()
app.use(express.static(static_path))
app.set('view engine','hbs')
app.set("views",template_path)
app.use(express.json())
app.use(express.urlencoded())
hbs.registerPartials(partials_path)

const port=process.env.port || 3000




// const securePassword= async (password)=>{
//     const hashedPasword=await bcrypt.hash(password,10)
//     console.log("awaited")
//     return hashedPasword;
// }


// const checkPassword = async (password,storedPassword)=>{
//     const hashedPasword=await securePassword(password);
//     if (storedPassword===hashedPasword){
//     return true;
//     }else{
//         return false;
//     }
// }



app.get('/',(req,res)=>{
    res.render('index.hbs')
})

app.get('/register',(req,res)=>{
    res.render('index.hbs')
})

app.get('/login',(req,res)=>{
    res.render('login.hbs')
})

app.post('/register',async (req,res)=>{
    try{
        const password=req.body.password
        const cpassword=req.body.cpassword
        if (password===cpassword ){
            const user=new Register({
                name:req.body.fullname,
                username:req.body.username,
                email:req.body.email,
                phone:req.body.phone,
                password:password,
                gender:req.body.gender,
            })
            // middleware
            const newUser=await user.save()
            console.log(newUser)
            res.status(201).send(newUser)
            // res.render('index.html')
        }else{
            res.send("password didn't match")
        }
    }catch(e){
    res.send(e)    
    }
})

app.post('/login',async (req,res)=>{
    try{
        email=req.body.email,
        password=req.body.password
        const user=await Register.findOne({email:email})
        const isMatch=await bcrypt.compare(password,user.password)
        console.log(isMatch)

        if(isMatch){
            res.status(200).render('home')
        }else{
            res.status(400).send(`incorrect password, ${user}`)
        }
    }catch(e){
        res.send("error occured")
    }
})













// $2a$10$55/nkiXLab1C5/FgvL4HROXRYy.YuhLXXPOzCQtz2ZZHYvl2x3p.6



















app.listen(port,()=>{
    console.log(`listening at port ${port}`)
})
