require('dotenv').config()
const express=require('express');
require('./db/conn')
const path=require('path')
const hbs=require('hbs')
const Register=require('./models/user')
const bcrypt=require('bcryptjs');
const cookieParser=require('cookie-parser')
let salt = bcrypt.genSaltSync(10);
const auth=require('./middleware/auth')


const bodyParser = require('body-parser');
const { hasSubscribers } = require('diagnostics_channel');

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
const port=process.env.PORT || 3000


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


app.get('/home',auth,(req,res)=>{
    console.log("on home page geting thecookies stred by user login=======")
    console.log(req.cookies.jwt)
    res.render('home.hbs')
})


app.get('/logout',auth,async (req,res)=>{
    try{
        console.log(req.user)
        //Logout from single device requires to delete the specific token from the array of tokens
       
        // req.user.tokens=req.user.tokens.filter((ele)=>{
        //     return ele.token != req.token
        // })
        res.clearCookie("jwt");
        console.log("logout successful")
        await req.user.save()
         //logout from all devices requires to delete all the tokens of the user
        req.user.tokens=[]
        await req.user.save()
         res.render('login')


        }catch(e){
        console.log(e)
        res.status(500).send(e)
    }

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
                cpassword:password
            })
            // middleware
            const token=await user.generateAuthToken();
            console.log("token : ",token)


            res.cookie("jwt",token,{
                expires:new Date(Date.now() + 60000),
                httpOnly:true
            })
            const newUser=await user.save()
            console.log(newUser)
            res.status(201).send(newUser)
        }else{
            res.send("password didn't match")
        }
    }catch(e){
        res.send(e)    
    }
})

app.post('/login',async (req,res)=>{
        try {
            const email = req.body.email;
            const password = req.body.password;
    
            const user = await Register.findOne({ email: email });
    
            if (user) {
                const check = await bcrypt.compare(password.trim(), user.password);
                console.log('Password match:', check);

                const token=await user.generateAuthToken();
                if (check) {
                    console.log("token:      ",token)
                    console.log(" ")
                    res.cookie("jwt",token,{
                        expires:new Date(Date.now() + 60000),
                        httpOnly:true
                    })
                    
                    console.log(req.cookies.jwt)
                    res.status(200).redirect('/home');
                } else {
                    res.status(400).send('Incorrect password');
                }
            } else {
                res.send('User not found');
            }
        } catch (e) {
            console.error('Error:', e);
            res.status(500).send('An error occurred');
        }
    });
    


app.listen(port,()=>{
    console.log(`listening at port ${port}`)
})
