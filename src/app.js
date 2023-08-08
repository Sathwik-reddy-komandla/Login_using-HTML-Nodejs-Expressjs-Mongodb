const express=require('express');
require('./db/conn')
const path=require('path')
const hbs=require('hbs')
const Register=require('./models/user')

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

app.get('/',(req,res)=>{
    res.render('index.hbs')
})

app.post('/register',async (req,res)=>{
    try{
        const password=req.body.password
        const cpassword=req.body.cpassword
        console.log(password)
        if (password===cpassword ){
            const user=new Register({
                name:req.body.fullname,
                username:req.body.username,
                email:req.body.email,
                phone:req.body.phone,
                password:req.body.password,
                gender:req.body.gender,

            })
            const newUser=await user.save()
            res.status(201).send(newUser)
            res.render('index.html')
        }else{
            res.send("password didn't match")
        }
    }catch(e){
    res.send(e)    
    }
})



app.listen(port,()=>{
    console.log(`listening at port ${port}`)
})