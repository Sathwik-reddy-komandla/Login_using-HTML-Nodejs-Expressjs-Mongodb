const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/UserRegistration')
    .then(()=>{
        console.log("connected Successfully")
    })
    .catch((e)=>{
        console.log("error connecting to database")
        console.log(e)
    })