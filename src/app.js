require('dotenv').config()
const express=require('express');
require('./db/conn')
const path=require('path')
const hbs=require('hbs')
const Register=require('./models/user')
const bcrypt=require('bcryptjs');

let salt = bcrypt.genSaltSync(10);


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
            const newUser=await user.save()
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
                    res.status(200).render('home');
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
    











// $2a$10$55/nkiXLab1C5/FgvL4HROXRYy.YuhLXXPOzCQtz2ZZHYvl2x3p.6
















app.listen(port,()=>{
    console.log(`listening at port ${port}`)
})
